/*
  Warnings:

  - You are about to drop the `servidores` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "servidores";

-- DropEnum
DROP TYPE "Escolaridade";

-- DropEnum
DROP TYPE "Genero";

-- DropEnum
DROP TYPE "Nivel";

-- DropEnum
DROP TYPE "Racacor";

-- DropEnum
DROP TYPE "Sexo";

-- CreateTable
CREATE TABLE "Sexo" (
    "id_sexo" SERIAL NOT NULL,
    "descricao" VARCHAR(10) NOT NULL,

    CONSTRAINT "Sexo_pkey" PRIMARY KEY ("id_sexo")
);

-- CreateTable
CREATE TABLE "Genero" (
    "id_genero" SERIAL NOT NULL,
    "descricao" TEXT NOT NULL,

    CONSTRAINT "Genero_pkey" PRIMARY KEY ("id_genero")
);

-- CreateTable
CREATE TABLE "Racacor" (
    "id_racacor" SERIAL NOT NULL,
    "descricao" VARCHAR(10) NOT NULL,

    CONSTRAINT "Racacor_pkey" PRIMARY KEY ("id_racacor")
);

-- CreateTable
CREATE TABLE "Escolaridade" (
    "id_escolaridade" SERIAL NOT NULL,
    "descricao" VARCHAR(20) NOT NULL,

    CONSTRAINT "Escolaridade_pkey" PRIMARY KEY ("id_escolaridade")
);

-- CreateTable
CREATE TABLE "Nivel" (
    "id_nivel" SERIAL NOT NULL,
    "descricao" VARCHAR(10) NOT NULL,

    CONSTRAINT "Nivel_pkey" PRIMARY KEY ("id_nivel")
);

-- CreateTable
CREATE TABLE "Servidores" (
    "id_servidor" SERIAL NOT NULL,
    "matricula" VARCHAR(50) NOT NULL,
    "nome_completo" VARCHAR(150) NOT NULL,
    "nome_social" VARCHAR(150),
    "cpf" VARCHAR(11) NOT NULL,
    "rg" VARCHAR(11) NOT NULL,
    "data_nascimento" TIMESTAMP(3) NOT NULL,
    "nome_mae" VARCHAR(150) NOT NULL,
    "nome_pai" VARCHAR(150) NOT NULL,
    "sexo_id" INTEGER NOT NULL,
    "genero_id" INTEGER NOT NULL,
    "racacor_id" INTEGER NOT NULL,
    "escolaridade_id" INTEGER NOT NULL,
    "nivel_id" INTEGER NOT NULL,
    "telefone" VARCHAR(11) NOT NULL,
    "email" VARCHAR(150) NOT NULL,
    "cep" VARCHAR NOT NULL,

    CONSTRAINT "Servidores_pkey" PRIMARY KEY ("id_servidor")
);

-- CreateIndex
CREATE UNIQUE INDEX "Servidores_matricula_key" ON "Servidores"("matricula");

-- CreateIndex
CREATE UNIQUE INDEX "Servidores_cpf_key" ON "Servidores"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "Servidores_rg_key" ON "Servidores"("rg");

-- AddForeignKey
ALTER TABLE "Servidores" ADD CONSTRAINT "Servidores_sexo_id_fkey" FOREIGN KEY ("sexo_id") REFERENCES "Sexo"("id_sexo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Servidores" ADD CONSTRAINT "Servidores_genero_id_fkey" FOREIGN KEY ("genero_id") REFERENCES "Genero"("id_genero") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Servidores" ADD CONSTRAINT "Servidores_racacor_id_fkey" FOREIGN KEY ("racacor_id") REFERENCES "Racacor"("id_racacor") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Servidores" ADD CONSTRAINT "Servidores_escolaridade_id_fkey" FOREIGN KEY ("escolaridade_id") REFERENCES "Escolaridade"("id_escolaridade") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Servidores" ADD CONSTRAINT "Servidores_nivel_id_fkey" FOREIGN KEY ("nivel_id") REFERENCES "Nivel"("id_nivel") ON DELETE RESTRICT ON UPDATE CASCADE;
