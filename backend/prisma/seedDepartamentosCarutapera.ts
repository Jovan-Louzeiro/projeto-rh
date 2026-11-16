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

const escolas = [
  { descricao: "Em Almirante Barroso", inep: "21066060" },
  { descricao: "Ue Humberto de Campos", inep: "21066094" },
  { descricao: "Em Luisa Lima de Araujo", inep: "21066116" },
  { descricao: "Em Prof Milton Maia", inep: "21066175" },
  { descricao: "Em Maria Izabel Maia Chagas", inep: "21066213" },
  { descricao: "Ue Adilson Dourado", inep: "21066361" },
  { descricao: "Em Dantas Dourado", inep: "21066370" },
  { descricao: "Ue Prof Elza Costa da Silva", inep: "21066469" },
  { descricao: "Ue Joao Paulo Ii", inep: "21066647" },
  { descricao: "Em Maximiliano Goncalves Teixeira", inep: "21066663" },
  {
    descricao: "Escola Municipal Agripino Pamplona de Menezes",
    inep: "21066680",
  },
  { descricao: "Em Olimpia Fernandes Oliveira", inep: "21066698" },
  { descricao: "Em Otaviano Reis", inep: "21066701" },
  { descricao: "Ue Sao Lourenco", inep: "21066957" },
  { descricao: "Ue Tancredo Neves", inep: "21067040" },
  { descricao: "Em Antonio de Oliveira Lima", inep: "21067104" },
  { descricao: "Escolinha Pe Luciano Gariglio", inep: "21067120" },
  { descricao: "Ui Ver Otavio Lauro Correa", inep: "21067163" },
  { descricao: "Ui Vila Dourado", inep: "21067171" },
  { descricao: "Ue Duque de Caxias", inep: "21067180" },
  { descricao: "Ue Sao Benedito", inep: "21067236" },
  { descricao: "Ue Profa Ordalinda Freitas", inep: "21067252" },
  { descricao: "Ue Sonho Dourado", inep: "21067279" },
  { descricao: "Ui Moacir Heraclito dos Remedios", inep: "21067287" },
  { descricao: "Ue Rural de 1 Grau Doralice Dourado", inep: "21067317" },
  { descricao: "Escola Municipal Jose Sebastiao Tavares", inep: "21260869" },
  {
    descricao: "Centro de Educação Infantil Professora Maria Isabel Silva Amorim",
    inep: "21245169",
  },
  {
    descricao: "Ui Vereador Laercio Fernandes de Oliveira",
    inep: "21251070",
  },
  { descricao: "Ui Vereadora Yolanda Dourado", inep: "21251096" },
  { descricao: "Em Prof Georgina B Ribeiro", inep: "21210462" },
  { descricao: "Em Rui Barbosa", inep: "21210470" },
  { descricao: "Em Cicilio Moreira da Silva", inep: "21222371" },
  { descricao: "Proinfancia Tipo C Rosa Brito de Oliveira", inep: "21277796" },
  { descricao: "Escola de Musica Edson do Rosario Pinto", inep: "21277990" },
  {
    descricao:
      "Centro de Referencia Educacional Professora Maria Valdionice Pereira da Silva",
    inep: "21275912",
  },
  {
    descricao:
      "Creche Municipal Tipo B Vereadora Guilhermina Escolastica Gomes Ferreira de Oliveira Lila",
    inep: "21282765",
  },
] as const;

async function main() {
  const result = await prisma.$transaction(async (transaction) => {
    const departamentosExistentes = await transaction.departamento.findMany({
      where: {
        OR: [
          { descricao: { in: escolas.map((escola) => escola.descricao) } },
          { inep: { in: escolas.map((escola) => escola.inep) } },
        ],
      },
      select: { id_departamento: true, descricao: true, inep: true },
    });
    const porDescricao = new Map<
      string,
      (typeof departamentosExistentes)[number]
    >();
    const porInep = new Map<string, (typeof departamentosExistentes)[number]>();
    for (const departamento of departamentosExistentes) {
      porDescricao.set(departamento.descricao, departamento);
      if (departamento.inep) {
        porInep.set(departamento.inep, departamento);
      }
    }

    const paraCriar: Array<{ descricao: string; inep: string }> = [];
    const paraVincular: Array<{ id_departamento: number; inep: string }> = [];
    let existentesPorInep = 0;

    for (const escola of escolas) {
      const departamentoPorDescricao = porDescricao.get(escola.descricao);
      const departamentoPorInep = porInep.get(escola.inep);

      if (
        departamentoPorDescricao &&
        departamentoPorInep &&
        departamentoPorDescricao.id_departamento !==
          departamentoPorInep.id_departamento
      ) {
        throw new Error(
          `Conflito: descrição "${escola.descricao}" e INEP ${escola.inep} já pertencem a departamentos diferentes.`,
        );
      }

      if (departamentoPorDescricao) {
        if (
          departamentoPorDescricao.inep &&
          departamentoPorDescricao.inep !== escola.inep
        ) {
          throw new Error(
            `Conflito: "${escola.descricao}" já possui o INEP ${departamentoPorDescricao.inep}.`,
          );
        }

        if (!departamentoPorDescricao.inep) {
          paraVincular.push({
            id_departamento: departamentoPorDescricao.id_departamento,
            inep: escola.inep,
          });
        }

        continue;
      }

      if (departamentoPorInep) {
        existentesPorInep += 1;
        continue;
      }

      paraCriar.push({
        descricao: escola.descricao,
        inep: escola.inep,
      });
    }

    if (paraCriar.length > 0) {
      await transaction.departamento.createMany({ data: paraCriar });
    }
    if (paraVincular.length > 0) {
      await Promise.all(
        paraVincular.map(({ id_departamento, inep }) =>
          transaction.departamento.update({
            where: { id_departamento },
            data: { inep },
          }),
        ),
      );
    }

    return {
      criados: paraCriar.length,
      vinculados: paraVincular.length,
      existentesPorInep,
    };
  });

  console.log(
    `Escolas municipais de Carutapera: ${result.criados} criadas, ${result.vinculados} INEPs vinculados, ${result.existentesPorInep} já existentes pelo INEP.`,
  );
}

main()
  .catch((error: unknown) => {
    console.error("Falha ao cadastrar escolas municipais de Carutapera:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
