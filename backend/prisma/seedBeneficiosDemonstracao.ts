import "dotenv/config";
import process from "node:process";
import { PrismaPg } from "@prisma/adapter-pg";
import { Prisma, PrismaClient } from "../generated/prisma/client.js";
import {
  SituacaoFerias,
  SituacaoLicenca,
  SituacaoQuinquenio,
} from "../generated/prisma/enums.js";

const connectionString = process.env.SEED_DATABASE_URL ?? process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("Configure SEED_DATABASE_URL para o banco local de desenvolvimento.");
}

const databaseUrl = new URL(connectionString);
const bancoLocal = ["localhost", "127.0.0.1", "::1", "[::1]"].includes(databaseUrl.hostname.toLowerCase());
if (!bancoLocal && process.env.ALLOW_REMOTE_DEMO_SEED !== "1") {
  throw new Error(
    "Este seed exige banco local ou autorização explícita ALLOW_REMOTE_DEMO_SEED=1 para banco remoto.",
  );
}
if (!bancoLocal) {
  console.warn("ATENÇÃO: autorização explícita habilitada; registros sintéticos serão gravados no banco remoto.");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

const quantidade = 30;
const marcaLote = "RH-DEMO-BENEFICIOS-2026";
const marcaServidores = "DADOS SINTETICOS RH-DEMO-CARUTAPERA-2026-";
const milissegundosPorDia = 24 * 60 * 60 * 1000;
const tiposLicenca = [
  "Licença para tratamento de saúde",
  "Licença maternidade",
  "Licença paternidade",
  "Licença para tratar de interesse particular",
  "Afastamento para mandato eletivo",
  "Licença para qualificação profissional",
];

type ServidorDemonstracao = {
  id_servidor: number;
  matriculas: Array<{ id_matricula: number; admissao: Date }>;
};

function dataAtual(): Date {
  const partes = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const valores = Object.fromEntries(partes.map((parte) => [parte.type, parte.value]));
  return new Date(`${valores.year}-${valores.month}-${valores.day}T00:00:00.000Z`);
}

function adicionarDias(data: Date, dias: number): Date {
  return new Date(data.getTime() + dias * milissegundosPorDia);
}

function adicionarAnos(data: Date, anos: number): Date {
  const resultado = new Date(data);
  resultado.setUTCFullYear(resultado.getUTCFullYear() + anos);
  return resultado;
}

function marcador(categoria: string, indice: number): string {
  return `${marcaLote}:${categoria}:${String(indice).padStart(3, "0")} | Dados sinteticos para desenvolvimento.`;
}

function indicesExistentes(
  categoria: string,
  registros: Array<{ servidor_id: number; observacoes: string | null }>,
  idsServidoresDemo: Set<number>,
): { indices: Set<number>; servidores: Set<number> } {
  if (registros.length > quantidade) {
    throw new Error(`O lote ${categoria} contém mais de ${quantidade} registros; nada foi alterado.`);
  }

  const prefixo = `${marcaLote}:${categoria}:`;
  const indices = new Set<number>();
  const servidores = new Set<number>();
  for (const registro of registros) {
    const texto = registro.observacoes ?? "";
    const correspondencia = texto.startsWith(prefixo)
      ? /^(\d{3}) \|/.exec(texto.slice(prefixo.length))
      : null;
    const indice = correspondencia ? Number(correspondencia[1]) : 0;
    if (
      indice < 1
      || indice > quantidade
      || indices.has(indice)
      || !idsServidoresDemo.has(registro.servidor_id)
      || servidores.has(registro.servidor_id)
    ) {
      throw new Error(`Marcador duplicado ou inválido no lote ${categoria}; nada foi alterado.`);
    }
    indices.add(indice);
    servidores.add(registro.servidor_id);
  }
  return { indices, servidores };
}

function selecionarServidor(
  servidores: ServidorDemonstracao[],
  usados: Set<number>,
  conflitos: Map<number, Array<{ inicio: Date; fim: Date }>>,
  inicio: Date,
  fim: Date,
): ServidorDemonstracao | undefined {
  const candidato = servidores.find((servidor) => {
    if (usados.has(servidor.id_servidor)) return false;
    return !(conflitos.get(servidor.id_servidor) ?? []).some(
      (periodo) => periodo.inicio <= fim && periodo.fim >= inicio,
    );
  });
  if (candidato) usados.add(candidato.id_servidor);
  return candidato;
}

function maximoQuinquenio(admissao: Date, hoje: Date): number {
  let quantidadeAnos = hoje.getUTCFullYear() - admissao.getUTCFullYear();
  if (adicionarAnos(admissao, quantidadeAnos) > hoje) quantidadeAnos -= 1;
  return Math.floor(quantidadeAnos / 5);
}

function numeroQuinquenioDisponivel(
  admissao: Date,
  hoje: Date,
  numerosUsados: Set<number>,
  preferido: number,
): number | undefined {
  const maximo = maximoQuinquenio(admissao, hoje);
  for (let deslocamento = 0; deslocamento < maximo; deslocamento += 1) {
    const numero = ((preferido - 1 + deslocamento) % maximo) + 1;
    if (!numerosUsados.has(numero)) return numero;
  }
  return undefined;
}

async function inserirLote(transaction: Prisma.TransactionClient) {
  const servidores: ServidorDemonstracao[] = await transaction.servidor.findMany({
    where: { observacao: { startsWith: marcaServidores }, ativo: true },
    orderBy: { id_servidor: "asc" },
    select: {
      id_servidor: true,
      matriculas: {
        where: { ativo: true },
        orderBy: [{ admissao: "desc" }, { id_matricula: "desc" }],
        take: 1,
        select: { id_matricula: true, admissao: true },
      },
    },
  });
  const servidoresComMatricula = servidores.filter((servidor) => servidor.matriculas.length > 0);
  if (servidoresComMatricula.length < quantidade) {
    throw new Error(
      `São necessários ${quantidade} servidores sintéticos com matrícula ativa; encontrados ${servidoresComMatricula.length}.`,
    );
  }
  const idsServidoresDemo = new Set(servidoresComMatricula.map((servidor) => servidor.id_servidor));
  const hoje = dataAtual();

  const [feriasExistentes, licencasExistentes, quinqueniosExistentes, todosQuinquenios] =
    await Promise.all([
      transaction.ferias.findMany({
        where: { observacoes: { startsWith: `${marcaLote}:FERIAS:` } },
        select: { servidor_id: true, observacoes: true },
      }),
      transaction.licenca.findMany({
        where: { observacoes: { startsWith: `${marcaLote}:LICENCAS:` } },
        select: { servidor_id: true, observacoes: true },
      }),
      transaction.quinquenio.findMany({
        where: { observacoes: { startsWith: `${marcaLote}:QUINQUENIOS:` } },
        select: { servidor_id: true, observacoes: true },
      }),
      transaction.quinquenio.findMany({
        where: { servidor_id: { in: [...idsServidoresDemo] } },
        select: { servidor_id: true, numero: true },
      }),
    ]);

  const feriasLote = indicesExistentes("FERIAS", feriasExistentes, idsServidoresDemo);
  const licencasLote = indicesExistentes("LICENCAS", licencasExistentes, idsServidoresDemo);
  const quinqueniosLote = indicesExistentes("QUINQUENIOS", quinqueniosExistentes, idsServidoresDemo);
  const feriasConflitos = await transaction.ferias.findMany({
    where: {
      servidor_id: { in: [...idsServidoresDemo] },
      situacao: { not: SituacaoFerias.CANCELADA },
    },
    select: { servidor_id: true, inicio: true, fim: true },
  });
  const licencasConflitos = await transaction.licenca.findMany({
    where: {
      servidor_id: { in: [...idsServidoresDemo] },
      situacao: { not: SituacaoLicenca.CANCELADA },
    },
    select: { servidor_id: true, inicio: true, termino: true },
  });

  const feriasPorServidor = new Map<number, Array<{ inicio: Date; fim: Date }>>();
  for (const registro of feriasConflitos) {
    const itens = feriasPorServidor.get(registro.servidor_id) ?? [];
    itens.push({ inicio: registro.inicio, fim: registro.fim });
    feriasPorServidor.set(registro.servidor_id, itens);
  }
  const licencasPorServidor = new Map<number, Array<{ inicio: Date; fim: Date }>>();
  for (const registro of licencasConflitos) {
    const itens = licencasPorServidor.get(registro.servidor_id) ?? [];
    itens.push({
      inicio: registro.inicio,
      fim: registro.termino ?? new Date("9999-12-31T00:00:00.000Z"),
    });
    licencasPorServidor.set(registro.servidor_id, itens);
  }

  const feriasParaCriar: Prisma.FeriasCreateManyInput[] = [];
  const feriasUsadas = new Set(feriasLote.servidores);
  for (let indice = 1; indice <= quantidade; indice += 1) {
    if (feriasLote.indices.has(indice)) continue;
    const inicio = adicionarDias(hoje, (indice - 15) * 20);
    const fim = adicionarDias(inicio, 13 + (indice % 3) * 7);
    const servidor = selecionarServidor(
      servidoresComMatricula,
      feriasUsadas,
      feriasPorServidor,
      inicio,
      fim,
    );
    if (!servidor) {
      throw new Error("Não há servidores sintéticos suficientes sem férias sobrepostas para completar o lote.");
    }
    const cancelada = indice % 13 === 0;
    feriasParaCriar.push({
      servidor_id: servidor.id_servidor,
      matricula_id: servidor.matriculas[0].id_matricula,
      periodo_aquisitivo_inicio: adicionarAnos(inicio, -1),
      periodo_aquisitivo_fim: adicionarDias(inicio, -1),
      dias_direito: 30,
      inicio,
      fim,
      dias: Math.floor((fim.getTime() - inicio.getTime()) / milissegundosPorDia) + 1,
      abono_pecuniario: indice % 4 === 0,
      antecipacao_decimo_terceiro: indice % 3 === 0,
      observacoes: marcador("FERIAS", indice),
      situacao: cancelada ? SituacaoFerias.CANCELADA : SituacaoFerias.APROVADA,
      aprovado_em: cancelada ? null : hoje,
      cancelado_em: cancelada ? hoje : null,
    });
    feriasPorServidor.set(servidor.id_servidor, [
      ...(feriasPorServidor.get(servidor.id_servidor) ?? []),
      { inicio, fim },
    ]);
  }

  const licencasParaCriar: Prisma.LicencaCreateManyInput[] = [];
  const licencasUsadas = new Set(licencasLote.servidores);
  for (let indice = 1; indice <= quantidade; indice += 1) {
    if (licencasLote.indices.has(indice)) continue;
    const inicio = adicionarDias(hoje, (indice - 15) * 23);
    const semDataTermino = indice % 10 === 0;
    const termino = semDataTermino ? null : adicionarDias(inicio, 13 + (indice % 4) * 14);
    const dataFimConflito = termino ?? new Date("9999-12-31T00:00:00.000Z");
    const servidor = selecionarServidor(
      servidoresComMatricula,
      licencasUsadas,
      licencasPorServidor,
      inicio,
      dataFimConflito,
    );
    if (!servidor) {
      throw new Error("Não há servidores sintéticos suficientes sem licenças sobrepostas para completar o lote.");
    }
    const cancelada = indice % 17 === 0;
    const dias = termino
      ? Math.floor((termino.getTime() - inicio.getTime()) / milissegundosPorDia) + 1
      : null;
    licencasParaCriar.push({
      servidor_id: servidor.id_servidor,
      matricula_id: servidor.matriculas[0].id_matricula,
      tipo: tiposLicenca[(indice - 1) % tiposLicenca.length],
      inicio,
      termino,
      sem_data_termino: semDataTermino,
      dias,
      previsao_retorno: semDataTermino ? adicionarDias(inicio, 90) : null,
      numero_documento: `DEMO-LIC-${String(indice).padStart(3, "0")}`,
      data_documento: adicionarDias(inicio, -1),
      orgao_emissor: "Secretaria Municipal de Administracao",
      observacoes: marcador("LICENCAS", indice),
      situacao: cancelada ? SituacaoLicenca.CANCELADA : SituacaoLicenca.APROVADA,
    });
    licencasPorServidor.set(servidor.id_servidor, [
      ...(licencasPorServidor.get(servidor.id_servidor) ?? []),
      { inicio, fim: dataFimConflito },
    ]);
  }

  const numerosPorServidor = new Map<number, Set<number>>();
  for (const registro of todosQuinquenios) {
    const numeros = numerosPorServidor.get(registro.servidor_id) ?? new Set<number>();
    numeros.add(registro.numero);
    numerosPorServidor.set(registro.servidor_id, numeros);
  }
  const quinqueniosParaCriar: Prisma.QuinquenioCreateManyInput[] = [];
  const quinqueniosUsados = new Set(quinqueniosLote.servidores);
  for (let indice = 1; indice <= quantidade; indice += 1) {
    if (quinqueniosLote.indices.has(indice)) continue;
    const servidor = servidoresComMatricula.find((candidato) => {
      if (quinqueniosUsados.has(candidato.id_servidor)) return false;
      const numeros = numerosPorServidor.get(candidato.id_servidor) ?? new Set<number>();
      return numeroQuinquenioDisponivel(candidato.matriculas[0].admissao, hoje, numeros, indice) !== undefined;
    });
    if (!servidor) {
      throw new Error("Não há 30 servidores sintéticos com quinquênios disponíveis para completar o lote.");
    }
    quinqueniosUsados.add(servidor.id_servidor);
    const numeros = numerosPorServidor.get(servidor.id_servidor) ?? new Set<number>();
    const numero = numeroQuinquenioDisponivel(
      servidor.matriculas[0].admissao,
      hoje,
      numeros,
      indice,
    );
    if (numero === undefined) {
      throw new Error(`Não foi possível calcular o número do quinquênio do servidor ${servidor.id_servidor}.`);
    }
    numeros.add(numero);
    numerosPorServidor.set(servidor.id_servidor, numeros);

    const admissao = servidor.matriculas[0].admissao;
    const inicioPeriodo = adicionarAnos(admissao, (numero - 1) * 5);
    const aquisicao = adicionarAnos(admissao, numero * 5);
    const inicioPagamento = adicionarDias(aquisicao, indice % 3 === 0 ? 30 : 0);
    const percentual = numero * 5;
    const cancelado = indice % 15 === 0;
    quinqueniosParaCriar.push({
      servidor_id: servidor.id_servidor,
      matricula_id: servidor.matriculas[0].id_matricula,
      numero,
      data_admissao: admissao,
      periodo_aquisitivo_inicio: inicioPeriodo,
      periodo_aquisitivo_fim: adicionarDias(aquisicao, -1),
      data_aquisicao: aquisicao,
      percentual_adicional: percentual,
      valor_calculado: Math.round(3500 * percentual) / 100,
      data_inicio_pagamento: inicioPagamento,
      situacao: cancelado ? SituacaoQuinquenio.CANCELADO : SituacaoQuinquenio.AGUARDANDO_CONCESSAO,
      ato_numero: `DEMO-PORTARIA-${String(indice).padStart(3, "0")}`,
      ato_tipo: "Portaria de demonstracao",
      ato_data: aquisicao,
      observacoes: marcador("QUINQUENIOS", indice),
      cancelado_em: cancelado ? hoje : null,
    });
  }

  if (feriasParaCriar.length > 0) await transaction.ferias.createMany({ data: feriasParaCriar });
  if (licencasParaCriar.length > 0) await transaction.licenca.createMany({ data: licencasParaCriar });
  if (quinqueniosParaCriar.length > 0) {
    await transaction.quinquenio.createMany({ data: quinqueniosParaCriar });
  }

  const [totalFerias, totalLicencas, totalQuinquenios] = await Promise.all([
    transaction.ferias.count({ where: { observacoes: { startsWith: `${marcaLote}:FERIAS:` } } }),
    transaction.licenca.count({ where: { observacoes: { startsWith: `${marcaLote}:LICENCAS:` } } }),
    transaction.quinquenio.count({ where: { observacoes: { startsWith: `${marcaLote}:QUINQUENIOS:` } } }),
  ]);
  if (totalFerias !== quantidade || totalLicencas !== quantidade || totalQuinquenios !== quantidade) {
    throw new Error(
      `Verificação do seed falhou: férias=${totalFerias}, licenças=${totalLicencas}, quinquênios=${totalQuinquenios}.`,
    );
  }
  return {
    ferias: feriasParaCriar.length,
    licencas: licencasParaCriar.length,
    quinquenios: quinqueniosParaCriar.length,
  };
}

async function main() {
  const adicionados = await prisma.$transaction(inserirLote, {
    maxWait: 10_000,
    timeout: 120_000,
  });
  console.log(
    `Seed de demonstração verificado: ${quantidade} férias, ${quantidade} licenças e ${quantidade} quinquênios. ` +
    `Criados nesta execução: ${adicionados.ferias}, ${adicionados.licencas} e ${adicionados.quinquenios}.`,
  );
}

main()
  .catch((error: unknown) => {
    console.error("Falha ao criar registros sintéticos de férias, licenças e quinquênios:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
