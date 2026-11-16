import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.js";
import process from "node:process";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL não está configurada.");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

const cargos = [
  "Professor(a) de Educação Infantil",
  "Professor(a) dos Anos Iniciais",
  "Professor(a) de Língua Portuguesa",
  "Professor(a) de Matemática",
  "Professor(a) de Ciências",
  "Professor(a) de História",
  "Professor(a) de Geografia",
  "Professor(a) de Língua Inglesa",
  "Professor(a) de Educação Física",
  "Professor(a) de Arte",
  "Professor(a) de Educação Especial",
  "Coordenador(a) Pedagógico(a)",
  "Diretor(a) Escolar",
  "Secretário(a) Escolar",
  "Auxiliar de Serviços Gerais Escolar",
];

const funcoes = [
  "Docência na Educação Infantil",
  "Docência nos Anos Iniciais",
  "Docência nos Anos Finais",
  "Atendimento Educacional Especializado (AEE)",
  "Planejamento Pedagógico",
  "Coordenação Pedagógica",
  "Direção Escolar",
  "Supervisão Pedagógica",
  "Orientação Educacional",
  "Gestão de Secretaria Escolar",
  "Apoio Administrativo Escolar",
  "Acompanhamento de Estudantes",
  "Mediação e Inclusão Escolar",
  "Preparo de Alimentação Escolar",
  "Conservação do Ambiente Escolar",
];

async function main() {
  const result = await prisma.$transaction(async (transaction) => {
    const cargosCriados = await transaction.cargo.createMany({
      data: cargos.map((descricao) => ({ descricao })),
      skipDuplicates: true,
    });
    const funcoesCriadas = await transaction.funcao.createMany({
      data: funcoes.map((descricao) => ({ descricao })),
      skipDuplicates: true,
    });

    return {
      cargos: cargosCriados.count,
      funcoes: funcoesCriadas.count,
    };
  });

  console.log(
    `Catálogo de educação: ${result.cargos} cargos e ${result.funcoes} funções adicionados; ${
      cargos.length - result.cargos
    } cargos e ${funcoes.length - result.funcoes} funções já existiam.`,
  );
}

main()
  .catch((error: unknown) => {
    console.error("Falha ao cadastrar cargos e funções da educação:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
