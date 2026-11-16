import "dotenv/config";
import { createHash } from "node:crypto";
import process from "node:process";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.js";
import type { Prisma } from "../generated/prisma/client.js";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL não está configurada.");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

const quantidade = 100;
const marcaLote = "DADOS SINTETICOS RH-DEMO-CARUTAPERA-2026-";
const cepCarutapera = "65295000";
const nomes = [
  { nome: "Ana Clara", sexo: "F", genero: "Mulher" },
  { nome: "João Pedro", sexo: "M", genero: "Homem" },
  { nome: "Maria Eduarda", sexo: "F", genero: "Mulher" },
  { nome: "José Carlos", sexo: "M", genero: "Homem" },
  { nome: "Larissa", sexo: "F", genero: "Mulher" },
  { nome: "Raimundo", sexo: "M", genero: "Homem" },
  { nome: "Francisca", sexo: "F", genero: "Mulher" },
  { nome: "Antônio", sexo: "M", genero: "Homem" },
  { nome: "Camila", sexo: "F", genero: "Mulher" },
  { nome: "Marcos", sexo: "M", genero: "Homem" },
  { nome: "Isabela", sexo: "F", genero: "Mulher" },
  { nome: "Francisco", sexo: "M", genero: "Homem" },
  { nome: "Juliana", sexo: "F", genero: "Mulher" },
  { nome: "Rafael", sexo: "M", genero: "Homem" },
  { nome: "Patrícia", sexo: "F", genero: "Mulher" },
  { nome: "Carlos", sexo: "M", genero: "Homem" },
  { nome: "Beatriz", sexo: "F", genero: "Mulher" },
  { nome: "Manoel", sexo: "M", genero: "Homem" },
  { nome: "Vitória", sexo: "F", genero: "Mulher" },
  { nome: "André", sexo: "M", genero: "Homem" },
] as const;

const sobrenomes = [
  "Silva",
  "Santos",
  "Costa",
  "Sousa",
  "Ferreira",
  "Lima",
  "Oliveira",
  "Pereira",
  "Rodrigues",
  "Almeida",
  "Nascimento",
  "Carvalho",
  "Gomes",
  "Ribeiro",
  "Martins",
  "Mendes",
  "Barros",
  "Cardoso",
  "Araújo",
  "Moreira",
];

const logradouros = [
  "Rua do Comercio",
  "Rua Sao Jose",
  "Avenida Principal",
  "Rua da Paz",
  "Travessa da Matriz",
  "Rua da Liberdade",
  "Rua do Campo",
  "Avenida Brasil",
  "Rua Nova",
  "Travessa das Flores",
];

const bairros = [
  "Centro",
  "Santa Rita",
  "Sao Jose",
  "Perpetuo Socorro",
  "Tres Poderes",
  "Nossa Senhora de Fatima",
  "Santo Antonio",
  "Vila Dourado",
];

function hashNumber(seed: string): number {
  return Number.parseInt(createHash("sha256").update(seed).digest("hex").slice(0, 8), 16);
}

function cpfDigit(digits: string): number {
  const sum = [...digits].reduce(
    (total, digit, index) =>
      total + Number(digit) * (digits.length + 1 - index),
    0,
  );
  const remainder = sum % 11;
  return remainder < 2 ? 0 : 11 - remainder;
}

function cpfFromBase(base: string): string {
  const firstDigit = cpfDigit(base);
  const secondDigit = cpfDigit(`${base}${firstDigit}`);
  return `${base}${firstDigit}${secondDigit}`;
}

function gerarCpf(index: number, ocupados: Set<string>): string {
  for (let attempt = 0; attempt < 10000; attempt += 1) {
    const baseNumber =
      100000000 +
      (hashNumber(`RH-DEMO-CARUTAPERA-2026:${index}:${attempt}`) % 900000000);
    const base = String(baseNumber);
    const cpf = cpfFromBase(base);

    if (new Set(cpf).size !== 1 && !ocupados.has(cpf)) {
      ocupados.add(cpf);
      return cpf;
    }
  }

  throw new Error(`Não foi possível gerar um CPF sintético livre para o registro ${index + 1}.`);
}

function gerarMatricula(index: number, ocupadas: Set<string>): string {
  for (let attempt = 0; attempt < 10000; attempt += 1) {
    const numero =
      100000 +
      (hashNumber(`MATRICULA-RH-DEMO-CARUTAPERA-2026:${index}:${attempt}`) %
        900000);
    const matricula = String(numero);

    if (!ocupadas.has(matricula)) {
      ocupadas.add(matricula);
      return matricula;
    }
  }

  throw new Error(`Não foi possível gerar uma matrícula livre para o registro ${index + 1}.`);
}

function descricaoRegistro(index: number): string {
  return `${marcaLote}${String(index + 1).padStart(3, "0")}/100. Registro ficticio para simulacao; nao representa pessoa real.`;
}

function exigirDescricao<T extends { descricao: string }>(
  registros: T[],
  descricao: string,
  tabela: string,
): T {
  const registro = registros.find((item) => item.descricao === descricao);
  if (!registro) {
    throw new Error(`Registro "${descricao}" não encontrado em ${tabela}.`);
  }
  return registro;
}

function ordenar<T extends { descricao: string }>(registros: T[]): T[] {
  return [...registros].sort((a, b) => a.descricao.localeCompare(b.descricao));
}

async function carregarCatalogos() {
  const [
    brasil,
    municipio,
    sexos,
    generos,
    racas,
    estadosCivis,
    escolaridades,
    ensinosMedios,
    zonas,
    situacoes,
    tiposVinculo,
    cargos,
    funcoes,
    departamentos,
  ] = await Promise.all([
    prisma.pais.findUnique({
      where: { codigo_iso: "BR" },
      select: { id_pais: true },
    }),
    prisma.municipio.findFirst({
      where: { nome: { equals: "Carutapera", mode: "insensitive" }, estado: { uf: "MA" } },
      select: { id_municipio: true },
    }),
    prisma.sexo.findMany({ where: { ativo: true }, select: { id_sexo: true, descricao: true } }),
    prisma.genero.findMany({ where: { ativo: true }, select: { id_genero: true, descricao: true } }),
    prisma.racaCor.findMany({ where: { ativo: true }, select: { id_racacor: true, descricao: true } }),
    prisma.estadoCivil.findMany({ where: { ativo: true }, select: { id_estado_civil: true, descricao: true } }),
    prisma.escolaridade.findMany({ where: { ativo: true }, select: { id_escolaridade: true, descricao: true } }),
    prisma.tipoEnsinoMedioCursado.findMany({
      where: { ativo: true },
      select: { id_tipo_ensino_medio_cursado: true, descricao: true },
    }),
    prisma.zonaEndereco.findMany({ where: { ativo: true }, select: { id_zona_endereco: true, descricao: true } }),
    prisma.situacao.findMany({ where: { ativo: true }, select: { id_situacao: true, descricao: true } }),
    prisma.tipoVinculo.findMany({ where: { ativo: true }, select: { id_tipo_vinculo: true, descricao: true } }),
    prisma.cargo.findMany({ where: { ativo: true }, select: { id_cargo: true, descricao: true } }),
    prisma.funcao.findMany({ where: { ativo: true }, select: { id_funcao: true, descricao: true } }),
    prisma.departamento.findMany({
      where: { ativo: true },
      select: { id_departamento: true, descricao: true },
    }),
  ]);

  if (!brasil) {
    throw new Error("País Brasil não encontrado. Execute primeiro o seed principal.");
  }
  if (!municipio) {
    throw new Error("Município Carutapera/MA não encontrado. Execute primeiro o seed principal.");
  }
  if (cargos.length === 0 || funcoes.length === 0 || departamentos.length === 0) {
    throw new Error(
      "Os catálogos de cargos, funções e departamentos precisam estar preenchidos antes do seed de servidores.",
    );
  }

  const sexoMap = new Map(sexos.map((item) => [item.descricao, item]));
  const generoMap = new Map(generos.map((item) => [item.descricao, item]));
  const racaMap = new Map(racas.map((item) => [item.descricao, item]));
  const estadoCivilMap = new Map(estadosCivis.map((item) => [item.descricao, item]));
  const escolaridadeMap = new Map(escolaridades.map((item) => [item.descricao, item]));
  const ensinoMedioMap = new Map(ensinosMedios.map((item) => [item.descricao, item]));
  const zonaMap = new Map(zonas.map((item) => [item.descricao, item]));
  const situacaoAtiva = exigirDescricao(situacoes, "Ativo", "Situação");
  const tiposVinculoOrdenados = ordenar(tiposVinculo);
  const cargosOrdenados = ordenar(cargos);
  const funcoesOrdenadas = ordenar(funcoes);
  const departamentosOrdenados = ordenar(departamentos);

  for (const descricao of ["M", "F", "I"]) exigirDescricao(sexos, descricao, "Sexo");
  for (const descricao of ["Branca", "Preta", "Parda", "Amarela", "Indígena"]) {
    exigirDescricao(racas, descricao, "Raça/cor");
  }
  for (const descricao of ["Urbana", "Rural"]) exigirDescricao(zonas, descricao, "Zona do endereço");
  for (const descricao of ["Efetivo", "Contratado", "Comissionado"]) {
    exigirDescricao(tiposVinculo, descricao, "Tipo de vínculo");
  }
  for (const descricao of ["Solteiro(a)", "Casado(a)", "Divorciado(a)", "Viúvo(a)"]) {
    exigirDescricao(estadosCivis, descricao, "Estado civil");
  }
  for (const descricao of [
    "Ensino Fundamental",
    "Ensino Médio",
    "Superior",
    "Pós-Graduação",
    "Doutorado",
  ]) {
    exigirDescricao(escolaridades, descricao, "Escolaridade");
  }

  return {
    brasil,
    municipio,
    sexoMap,
    generoMap,
    racaMap,
    estadoCivilMap,
    escolaridadeMap,
    ensinoMedioMap,
    zonaMap,
    situacaoAtiva,
    tiposVinculoOrdenados,
    cargosOrdenados,
    funcoesOrdenadas,
    departamentosOrdenados,
  };
}

type RegistroDemonstracao = {
  servidor: Prisma.ServidorCreateManyInput;
  contato: {
    tipo_contato: "TELEFONE_MOVEL";
    contato: string;
    principal: true;
  };
  matricula: {
    numero: string;
    admissao: Date;
    tipo_vinculo_id: number;
  };
  historico: {
    cargo_id: number;
    funcao_id: number;
    departamento_id: number;
    situacao_historico_funcional_id: number;
    data_inicio: Date;
    data_fim: null;
  };
};

function criarServidor(
  index: number,
  cpf: string,
  numeroMatricula: string,
  catalogos: Awaited<ReturnType<typeof carregarCatalogos>>,
): RegistroDemonstracao {
  const nome = nomes[index % nomes.length];
  const grupoSobrenome = Math.floor(index / nomes.length);
  const sobrenome1 = sobrenomes[grupoSobrenome % sobrenomes.length];
  const sobrenome2 =
    sobrenomes[(grupoSobrenome * 7 + (index % nomes.length) + 1) % sobrenomes.length];
  const nomeCompleto = `${nome.nome} ${sobrenome1} ${sobrenome2}`;
  const sexoDescricao = index % 25 === 0 ? "I" : nome.sexo;
  const generoDescricao =
    sexoDescricao === "I"
      ? ["Não Binário", "Outro", "Prefiro não informar", "Não Binário"][Math.floor(index / 25)]
      : nome.genero;
  const sexo = exigirDescricao([...catalogos.sexoMap.values()], sexoDescricao, "Sexo");
  const genero = catalogos.generoMap.get(generoDescricao);
  const raca = ["Parda", "Preta", "Branca", "Indígena", "Amarela"][index % 5];
  const estadoCivil = ["Casado(a)", "Solteiro(a)", "Divorciado(a)", "Viúvo(a)"][index % 4];
  const escolaridade = [
    "Superior",
    "Ensino Médio",
    "Pós-Graduação",
    "Ensino Fundamental",
    "Doutorado",
  ][index % 5];
  const tipoEnsinoMedio =
    index % 3 === 0
      ? ["Regular", "EJA", "Técnico"][Math.floor(index / 3) % 3]
      : undefined;
  const zona = index % 5 === 0 ? "Rural" : "Urbana";
  const tipoVinculo = catalogos.tiposVinculoOrdenados[index % catalogos.tiposVinculoOrdenados.length];
  const cargo = catalogos.cargosOrdenados[(index * 7) % catalogos.cargosOrdenados.length];
  const funcao = catalogos.funcoesOrdenadas[(index * 11) % catalogos.funcoesOrdenadas.length];
  const departamento =
    catalogos.departamentosOrdenados[(index * 13) % catalogos.departamentosOrdenados.length];
  const estadoCivilRegistro = catalogos.estadoCivilMap.get(estadoCivil);
  const escolaridadeRegistro = catalogos.escolaridadeMap.get(escolaridade);
  const zonaRegistro = catalogos.zonaMap.get(zona);
  const tipoEnsinoMedioRegistro = tipoEnsinoMedio
    ? catalogos.ensinoMedioMap.get(tipoEnsinoMedio)
    : undefined;

  if (!estadoCivilRegistro || !escolaridadeRegistro || !zonaRegistro) {
    throw new Error("Um catálogo necessário ao seed não foi encontrado.");
  }

  const anoNascimento = 1960 + ((index * 13) % 41);
  const mesNascimento = index % 12;
  const diaNascimento = (index * 3) % 27 + 1;
  const anoMinimoAdmissao = anoNascimento + 18;
  const anoAdmissao =
    anoMinimoAdmissao +
    ((index * 7) % Math.max(1, 2025 - anoMinimoAdmissao + 1));
  const dataAdmissao = new Date(
    Date.UTC(anoAdmissao, mesNascimento, Math.min(28, diaNascimento + 1)),
  );
  const corpoTelefone = String(900000000 + index + 1).padStart(9, "0");

  const dataNascimento = new Date(Date.UTC(anoNascimento, mesNascimento, diaNascimento));
  const servidor: Prisma.ServidorCreateManyInput = {
    nome_completo: nomeCompleto,
    cpf,
    data_nascimento: dataNascimento,
    nacionalidade_id: catalogos.brasil.id_pais,
    municipio_nascimento_id: catalogos.municipio.id_municipio,
    nome_mae: `Maria ${sobrenomes[(index * 3 + 5) % sobrenomes.length]} ${sobrenomes[(index + 11) % sobrenomes.length]}`,
    nome_pai: `José ${sobrenomes[(index * 5 + 2) % sobrenomes.length]} ${sobrenomes[(index + 7) % sobrenomes.length]}`,
    estado_civil_id: estadoCivilRegistro.id_estado_civil,
    sexo_id: sexo.id_sexo,
    ...(genero ? { genero_id: genero.id_genero } : {}),
    racacor_id: exigirDescricao([...catalogos.racaMap.values()], raca, "Raça/cor").id_racacor,
    cep: cepCarutapera,
    logradouro: logradouros[(index * 3) % logradouros.length],
    numero: String(10 + ((index * 17) % 990)),
    complemento: index % 4 === 0 ? `Casa ${String.fromCharCode(65 + (index % 6))}` : null,
    bairro: bairros[(index * 5) % bairros.length],
    municipio_endereco_id: catalogos.municipio.id_municipio,
    zona_endereco_id: zonaRegistro.id_zona_endereco,
    situacao_id: catalogos.situacaoAtiva.id_situacao,
    escolaridade_id: escolaridadeRegistro.id_escolaridade,
    ...(tipoEnsinoMedioRegistro
      ? { tipo_ensino_medio_cursado_id: tipoEnsinoMedioRegistro.id_tipo_ensino_medio_cursado }
      : {}),
    observacao: descricaoRegistro(index),
  };

  return {
    servidor,
    contato: {
      tipo_contato: "TELEFONE_MOVEL",
      contato: `(98) ${corpoTelefone.slice(0, 5)}-${corpoTelefone.slice(5)}`,
      principal: true,
    },
    matricula: {
      numero: numeroMatricula,
      admissao: dataAdmissao,
      tipo_vinculo_id: tipoVinculo.id_tipo_vinculo,
    },
    historico: {
      cargo_id: cargo.id_cargo,
      funcao_id: funcao.id_funcao,
      departamento_id: departamento.id_departamento,
      situacao_historico_funcional_id: catalogos.situacaoAtiva.id_situacao,
      data_inicio: dataAdmissao,
      data_fim: null,
    },
  };
}

async function main() {
  const catalogos = await carregarCatalogos();
  const servidoresMarcados = await prisma.servidor.findMany({
    where: { observacao: { startsWith: marcaLote } },
    select: { cpf: true, observacao: true },
  });
  const indicesExistentes = new Set<number>();

  for (const servidor of servidoresMarcados) {
    const correspondencia = servidor.observacao?.match(
      /^DADOS SINTETICOS RH-DEMO-CARUTAPERA-2026-(\d{3})\/100\./,
    );
    if (!correspondencia) {
      throw new Error(
        `Registro de simulação com marcador inválido (servidor ${servidor.cpf}).`,
      );
    }
    const index = Number(correspondencia[1]) - 1;
    if (index < 0 || index >= quantidade || indicesExistentes.has(index)) {
      throw new Error(`Marcador de registro duplicado ou fora do intervalo: ${correspondencia[1]}.`);
    }
    indicesExistentes.add(index);
  }

  if (servidoresMarcados.length > quantidade) {
    throw new Error(`Já existem mais de ${quantidade} registros do lote; nada foi alterado.`);
  }

  const [servidoresExistentes, matriculasExistentes] = await Promise.all([
    prisma.servidor.findMany({ select: { cpf: true } }),
    prisma.matricula.findMany({ select: { numero: true } }),
  ]);
  const cpfsOcupados = new Set(servidoresExistentes.map(({ cpf }) => cpf));
  const matriculasOcupadas = new Set(matriculasExistentes.map(({ numero }) => numero));
  const dadosParaCriar: RegistroDemonstracao[] = [];

  for (let index = 0; index < quantidade; index += 1) {
    if (indicesExistentes.has(index)) continue;
    const cpf = gerarCpf(index, cpfsOcupados);
    const numeroMatricula = gerarMatricula(index, matriculasOcupadas);
    dadosParaCriar.push(criarServidor(index, cpf, numeroMatricula, catalogos));
  }

  if (dadosParaCriar.length > 0) {
    await prisma.$transaction(async (transaction) => {
      await transaction.servidor.createMany({
        data: dadosParaCriar.map(({ servidor }) => servidor),
      });

      const cpfs = dadosParaCriar.map(({ servidor }) => servidor.cpf);
      const servidoresCriados = await transaction.servidor.findMany({
        where: { cpf: { in: cpfs } },
        select: { id_servidor: true, cpf: true },
      });
      if (servidoresCriados.length !== dadosParaCriar.length) {
        throw new Error("Não foi possível localizar todos os servidores recém-criados.");
      }
      const servidorIdPorCpf = new Map(
        servidoresCriados.map(({ cpf, id_servidor }) => [cpf, id_servidor]),
      );

      await transaction.contato.createMany({
        data: dadosParaCriar.map(({ servidor, contato }) => {
          const servidorId = servidorIdPorCpf.get(servidor.cpf);
          if (servidorId === undefined) {
            throw new Error(`Servidor não encontrado para CPF sintético ${servidor.cpf}.`);
          }
          return { ...contato, servidor_id: servidorId };
        }),
      });
      await transaction.matricula.createMany({
        data: dadosParaCriar.map(({ servidor, matricula }) => {
          const servidorId = servidorIdPorCpf.get(servidor.cpf);
          if (servidorId === undefined) {
            throw new Error(`Servidor não encontrado para CPF sintético ${servidor.cpf}.`);
          }
          return { ...matricula, servidor_id: servidorId };
        }),
      });

      const numerosMatricula = dadosParaCriar.map(({ matricula }) => matricula.numero);
      const matriculasCriadas = await transaction.matricula.findMany({
        where: { numero: { in: numerosMatricula } },
        select: { id_matricula: true, numero: true },
      });
      if (matriculasCriadas.length !== dadosParaCriar.length) {
        throw new Error("Não foi possível localizar todas as matrículas recém-criadas.");
      }
      const matriculaIdPorNumero = new Map(
        matriculasCriadas.map(({ numero, id_matricula }) => [numero, id_matricula]),
      );

      await transaction.historicoFuncional.createMany({
        data: dadosParaCriar.map(({ matricula, historico }) => {
          const matriculaId = matriculaIdPorNumero.get(matricula.numero);
          if (matriculaId === undefined) {
            throw new Error(`Matrícula ${matricula.numero} não encontrada após inserção.`);
          }
          return { ...historico, matricula_id: matriculaId };
        }),
      });
    }, { maxWait: 10_000, timeout: 120_000 });
  }

  const resultado = await prisma.servidor.findMany({
    where: { observacao: { startsWith: marcaLote } },
    select: {
      municipio_endereco_id: true,
      municipio_nascimento_id: true,
      contatos: {
        where: { tipo_contato: "TELEFONE_MOVEL" },
        select: { id_contato: true },
      },
      matriculas: {
        select: {
          id_matricula: true,
          numero: true,
          historicos_funcionais: {
            where: { data_fim: null },
            select: {
              id_historico_funcional: true,
              situacao: { select: { descricao: true } },
            },
          },
        },
      },
    },
  });
  const completos = resultado.filter(
    (servidor) =>
      servidor.municipio_endereco_id === catalogos.municipio.id_municipio &&
      servidor.municipio_nascimento_id === catalogos.municipio.id_municipio &&
      servidor.contatos.length > 0 &&
      servidor.matriculas.some((matricula) =>
        Boolean(matricula.numero) &&
        matricula.historicos_funcionais.some(
          (historico) => historico.situacao.descricao === "Ativo",
        ),
      ),
  ).length;

  if (resultado.length !== quantidade || completos !== quantidade) {
    throw new Error(
      `Verificação final falhou: ${resultado.length} registros encontrados, ${completos} completos em Carutapera com telefone, matrícula e histórico ativo.`,
    );
  }

  console.log(
    `Seed concluído: ${dadosParaCriar.length} servidores sintéticos adicionados; ${resultado.length} registros do lote verificados, todos em Carutapera e com telefone, matrícula e histórico funcional atual.`,
  );
}

main()
  .catch((error: unknown) => {
    console.error("Falha ao criar servidores sintéticos de Carutapera:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
