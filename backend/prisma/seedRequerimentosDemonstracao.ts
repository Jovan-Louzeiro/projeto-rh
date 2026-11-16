import "dotenv/config";
import process from "node:process";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.js";
import type { Prisma } from "../generated/prisma/client.js";
import {
  SITUACOES_REQUERIMENTO,
  TIPOS_REQUERIMENTO,
  type SituacaoRequerimento,
} from "../src/modules/documentos/schemas/requerimento.schema.js";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL não está configurada.");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

const quantidade = 60;
const marcaLote = "RH-DEMO-CARUTAPERA-REQUERIMENTOS-2026";
const marcaServidores = "DADOS SINTETICOS RH-DEMO-CARUTAPERA-2026-";
const responsavelDemonstracao = "Equipe de RH (simulação)";

function dataIsoLocal(data: Date): string {
  const partes = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(data);
  const valores = Object.fromEntries(partes.map((parte) => [parte.type, parte.value]));
  return `${valores.year}-${valores.month}-${valores.day}`;
}

function obterHistoricoSituacoes(
  situacaoFinal: SituacaoRequerimento,
): SituacaoRequerimento[] {
  switch (situacaoFinal) {
    case "Pendente":
      return ["Pendente"];
    case "Em análise":
      return ["Pendente", "Em análise"];
    case "Deferido":
      return ["Pendente", "Em análise", "Deferido"];
    case "Indeferido":
      return ["Pendente", "Em análise", "Indeferido"];
    case "Finalizado":
      return ["Pendente", "Em análise", "Deferido", "Finalizado"];
    case "Cancelado":
      return ["Pendente", "Cancelado"];
  }
}

function criarDadosHistoricos(
  servidor: {
    id_servidor: number;
    nome_completo: string;
    cpf: string;
    logradouro: string;
    numero: string | null;
    bairro: string;
    municipio_endereco: { nome: string };
    contatos: Array<{ contato: string }>;
  },
  matricula: {
    id_matricula: number;
    numero: string;
    admissao: Date;
    historicos_funcionais: Array<{
      cargo: { descricao: string };
      funcao: { descricao: string } | null;
      departamento: { descricao: string } | null;
    }>;
  },
  index: number,
  tipo: (typeof TIPOS_REQUERIMENTO)[number],
  situacao: SituacaoRequerimento,
  entrada: Date,
): Prisma.InputJsonObject {
  const funcional = matricula.historicos_funcionais[0];
  if (!funcional) {
    throw new Error(`O servidor sintético ${servidor.id_servidor} não possui histórico funcional atual.`);
  }

  const caminho = obterHistoricoSituacoes(situacao);
  const diasDesdeEntrada = Math.max(
    1,
    Math.floor((Date.now() - entrada.getTime()) / (24 * 60 * 60 * 1000)),
  );
  const intervaloDias = Math.max(1, Math.floor(diasDesdeEntrada / caminho.length));
  const eventos: Prisma.InputJsonArray = caminho.map((situacaoNova, posicao) => {
    const dataEvento = new Date(
      entrada.getTime() + Math.min(posicao * intervaloDias, diasDesdeEntrada) * 24 * 60 * 60 * 1000,
    );
    const evento: Prisma.InputJsonObject = {
      id: `${marcaLote}-${String(index + 1).padStart(3, "0")}-${posicao + 1}`,
      dataHora: dataEvento.toISOString(),
      situacaoNova,
      responsavel: posicao === 0 ? "Registro de demonstração" : responsavelDemonstracao,
      observacao:
        posicao === 0
          ? "Requerimento sintético registrado para demonstração."
          : `Situação de demonstração alterada para ${situacaoNova}.`,
    };

    if (posicao > 0) {
      evento.situacaoAnterior = caminho[posicao - 1];
    }

    return evento;
  });

  const dataEntrada = dataIsoLocal(entrada);
  const dataHoraAssinatura = entrada.toISOString();

  return {
    data_entrada: dataEntrada,
    nome_completo: servidor.nome_completo,
    matricula_numero: matricula.numero,
    admissao_matricula: dataIsoLocal(matricula.admissao),
    cargo_descricao: funcional.cargo.descricao,
    funcao_descricao: funcional.funcao?.descricao ?? "",
    departamento_descricao: funcional.departamento?.descricao ?? "",
    endereco_logradouro: servidor.logradouro,
    numero_endereco: servidor.numero ?? "",
    bairro_endereco: servidor.bairro,
    cidade_endereco: servidor.municipio_endereco.nome,
    telefone: servidor.contatos[0]?.contato ?? "",
    cpf: servidor.cpf,
    tipos: [tipo],
    outro_especificacao:
      tipo === "Outros" ? "Solicitação administrativa diversa." : "",
    justificativa: "",
    situacao,
    responsavel: responsavelDemonstracao,
    assinatura: {
      aceite: true,
      dataHora: dataHoraAssinatura,
      usuario: "Registro de demonstração",
    },
    historico: eventos,
    lote_simulacao: marcaLote,
    registro_simulacao: index + 1,
  };
}

async function carregarTipos() {
  const existentes = await prisma.tipoRequerimento.findMany({
    where: { descricao: { in: [...TIPOS_REQUERIMENTO] } },
    select: { id_tipo_requerimento: true, descricao: true },
  });
  const descricoesExistentes = new Set(existentes.map(({ descricao }) => descricao));
  const faltantes = TIPOS_REQUERIMENTO.filter(
    (descricao) => !descricoesExistentes.has(descricao),
  );

  if (faltantes.length > 0) {
    await prisma.tipoRequerimento.createMany({
      data: faltantes.map((descricao) => ({ descricao })),
    });
  }

  const catalogo = await prisma.tipoRequerimento.findMany({
    where: { descricao: { in: [...TIPOS_REQUERIMENTO] }, ativo: true },
    select: { id_tipo_requerimento: true, descricao: true },
    orderBy: { id_tipo_requerimento: "asc" },
  });
  const porDescricao = new Map<string, number>();
  for (const tipo of catalogo) {
    if (!porDescricao.has(tipo.descricao)) {
      porDescricao.set(tipo.descricao, tipo.id_tipo_requerimento);
    }
  }

  for (const descricao of TIPOS_REQUERIMENTO) {
    if (!porDescricao.has(descricao)) {
      throw new Error(`Tipo de requerimento "${descricao}" não encontrado no catálogo.`);
    }
  }

  return porDescricao;
}

async function main() {
  const ano = new Date().getFullYear();
  const [servidores, tiposRequerimento, protocolosExistentes, loteExistente] =
    await Promise.all([
      prisma.servidor.findMany({
        where: { observacao: { startsWith: marcaServidores } },
        orderBy: { id_servidor: "asc" },
        select: {
          id_servidor: true,
          nome_completo: true,
          cpf: true,
          logradouro: true,
          numero: true,
          bairro: true,
          municipio_endereco: { select: { nome: true } },
          contatos: {
            where: { ativo: true, tipo_contato: { in: ["TELEFONE_MOVEL", "TELEFONE_FIXO"] } },
            orderBy: [{ principal: "desc" }, { id_contato: "asc" }],
            take: 1,
            select: { contato: true },
          },
          matriculas: {
            where: { ativo: true },
            orderBy: { admissao: "desc" },
            take: 1,
            select: {
              id_matricula: true,
              numero: true,
              admissao: true,
              historicos_funcionais: {
                where: { data_fim: null },
                orderBy: { data_inicio: "desc" },
                take: 1,
                select: {
                  cargo: { select: { descricao: true } },
                  funcao: { select: { descricao: true } },
                  departamento: { select: { descricao: true } },
                },
              },
            },
          },
        },
      }),
      carregarTipos(),
      prisma.requerimento.findMany({
        select: { numero_protocolo: true },
      }),
      prisma.requerimento.findMany({
        where: {
          dados_historicos: {
            path: ["lote_simulacao"],
            equals: marcaLote,
          },
        },
        select: { numero_protocolo: true, dados_historicos: true },
      }),
    ]);

  if (servidores.length < quantidade) {
    throw new Error(
      `São necessários ${quantidade} servidores sintéticos de Carutapera; encontrados ${servidores.length}.`,
    );
  }

  const indicesExistentes = new Set<number>();
  for (const requerimento of loteExistente) {
    const dados = requerimento.dados_historicos;
    if (!dados || typeof dados !== "object" || Array.isArray(dados)) {
      throw new Error(`Dados inválidos no requerimento sintético ${requerimento.numero_protocolo}.`);
    }
    const index = dados.registro_simulacao;
    if (typeof index !== "number" || index < 1 || index > quantidade || indicesExistentes.has(index)) {
      throw new Error(`Marcador de lote duplicado ou inválido no protocolo ${requerimento.numero_protocolo}.`);
    }
    indicesExistentes.add(index);
  }

  if (loteExistente.length > quantidade) {
    throw new Error(`Já existem mais de ${quantidade} registros do lote; nada foi alterado.`);
  }

  const numerosOcupados = new Set<number>();
  for (const { numero_protocolo: protocolo } of protocolosExistentes) {
    const correspondencia = /^(\d{1,4})\/(\d{4})$/.exec(protocolo);
    if (correspondencia?.[2] === String(ano)) {
      numerosOcupados.add(Number(correspondencia[1]));
    }
  }

  const dadosParaCriar: Prisma.RequerimentoCreateManyInput[] = [];
  let proximoNumero = 1;
  for (let index = 0; index < quantidade; index += 1) {
    if (indicesExistentes.has(index + 1)) continue;

    while (numerosOcupados.has(proximoNumero) && proximoNumero <= 9999) {
      proximoNumero += 1;
    }
    if (proximoNumero > 9999) {
      throw new Error(`Não há protocolos disponíveis para o ano ${ano}.`);
    }

    const protocolo = `${String(proximoNumero).padStart(2, "0")}/${ano}`;
    numerosOcupados.add(proximoNumero);
    proximoNumero += 1;

    const servidor = servidores[(index * 7) % servidores.length];
    const matricula = servidor.matriculas[0];
    if (!matricula) {
      throw new Error(`Servidor sintético ${servidor.id_servidor} não possui matrícula ativa.`);
    }
    if (servidor.municipio_endereco.nome.toLocaleLowerCase() !== "carutapera") {
      throw new Error(`Servidor sintético ${servidor.id_servidor} não está em Carutapera.`);
    }

    const tipo = TIPOS_REQUERIMENTO[index % TIPOS_REQUERIMENTO.length];
    const situacao =
      SITUACOES_REQUERIMENTO[index % SITUACOES_REQUERIMENTO.length];
    const diasAtras = 4 + ((index * 37) % 365);
    const dataEntrada = new Date(Date.now() - diasAtras * 24 * 60 * 60 * 1000);
    const tipoId = tiposRequerimento.get(tipo);
    if (tipoId === undefined) {
      throw new Error(`Tipo de requerimento "${tipo}" não possui identificador.`);
    }

    dadosParaCriar.push({
      numero_protocolo: protocolo,
      tipo_requerimento_id: tipoId,
      servidor_id: servidor.id_servidor,
      matricula_id: matricula.id_matricula,
      dados_historicos: criarDadosHistoricos(
        servidor,
        matricula,
        index,
        tipo,
        situacao,
        dataEntrada,
      ),
      criado_em: dataEntrada,
    });
  }

  if (dadosParaCriar.length > 0) {
    await prisma.requerimento.createMany({ data: dadosParaCriar });
  }

  const verificados = await prisma.requerimento.findMany({
    where: {
      dados_historicos: {
        path: ["lote_simulacao"],
        equals: marcaLote,
      },
    },
    select: {
      numero_protocolo: true,
      dados_historicos: true,
      servidor: {
        select: {
          id_servidor: true,
          municipio_endereco: { select: { nome: true } },
        },
      },
      matricula: {
        select: {
          servidor_id: true,
          historicos_funcionais: {
            where: { data_fim: null },
            select: { id_historico_funcional: true },
          },
        },
      },
    },
  });
  const indicesVerificados = new Set<number>();
  const servidoresVinculados = new Set<number>();
  const tiposVerificados = new Set<string>();
  const situacoesVerificadas = new Set<string>();
  for (const requerimento of verificados) {
    const dados = requerimento.dados_historicos;
    if (!dados || typeof dados !== "object" || Array.isArray(dados)) {
      throw new Error(`Dados inválidos no protocolo ${requerimento.numero_protocolo}.`);
    }

    const index = dados.registro_simulacao;
    const situacao = dados.situacao;
    const tipos = dados.tipos;
    const eventos = dados.historico;
    const assinatura = dados.assinatura;
    const ultimoEvento =
      Array.isArray(eventos) && eventos.length > 0
        ? eventos[eventos.length - 1]
        : undefined;

    if (
      typeof index !== "number" ||
      index < 1 ||
      index > quantidade ||
      indicesVerificados.has(index)
    ) {
      throw new Error(`Índice sintético duplicado ou inválido no protocolo ${requerimento.numero_protocolo}.`);
    }
    if (
      !new RegExp(`^\\d{1,4}\\/${ano}$`).test(requerimento.numero_protocolo) ||
      requerimento.servidor.municipio_endereco.nome.toLocaleLowerCase() !== "carutapera" ||
      requerimento.matricula.servidor_id !== requerimento.servidor.id_servidor ||
      requerimento.matricula.historicos_funcionais.length === 0
    ) {
      throw new Error(`Vínculo, localidade ou protocolo inválido em ${requerimento.numero_protocolo}.`);
    }
    if (
      typeof situacao !== "string" ||
      !SITUACOES_REQUERIMENTO.some((item) => item === situacao) ||
      !Array.isArray(tipos) ||
      tipos.length !== 1 ||
      typeof tipos[0] !== "string" ||
      !TIPOS_REQUERIMENTO.some((item) => item === tipos[0]) ||
      typeof dados.telefone !== "string" ||
      dados.telefone.length === 0 ||
      !Array.isArray(eventos) ||
      !ultimoEvento ||
      typeof ultimoEvento !== "object" ||
      Array.isArray(ultimoEvento) ||
      ultimoEvento.situacaoNova !== situacao ||
      !assinatura ||
      typeof assinatura !== "object" ||
      Array.isArray(assinatura) ||
      assinatura.aceite !== true
    ) {
      throw new Error(`Dados de situação, tipo, telefone ou histórico inválidos em ${requerimento.numero_protocolo}.`);
    }

    indicesVerificados.add(index);
    servidoresVinculados.add(requerimento.servidor.id_servidor);
    tiposVerificados.add(tipos[0]);
    situacoesVerificadas.add(situacao);
  }

  if (
    verificados.length !== quantidade ||
    indicesVerificados.size !== quantidade ||
    servidoresVinculados.size !== quantidade ||
    tiposVerificados.size !== TIPOS_REQUERIMENTO.length ||
    situacoesVerificadas.size !== SITUACOES_REQUERIMENTO.length
  ) {
    throw new Error(
      `Verificação final falhou: ${verificados.length} registros, ${servidoresVinculados.size} servidores, ${tiposVerificados.size} tipos e ${situacoesVerificadas.size} situações verificados.`,
    );
  }

  console.log(
    `Seed concluído: ${dadosParaCriar.length} requerimentos sintéticos adicionados; ${verificados.length} registros do lote verificados, com protocolos de ${ano}, servidores de Carutapera e situações variadas.`,
  );
}

main()
  .catch((error: unknown) => {
    console.error("Falha ao criar requerimentos sintéticos de Carutapera:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
