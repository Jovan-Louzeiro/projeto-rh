-- CreateEnum
CREATE TYPE "Sexo" AS ENUM ('MASCULINO', 'FEMININO', 'INTERSEXO', 'NAO_INFORMADO');

-- CreateEnum
CREATE TYPE "Genero" AS ENUM ('HOMEM', 'MULHER', 'NAO_BINARIO', 'NAO_INFORMADO', 'OUTRO');

-- CreateEnum
CREATE TYPE "Escolaridade" AS ENUM ('NAO_INFORMADO', 'FUNDAMENTAL_INCOMPLETO', 'FUNDAMENTAL_COMPLETO', 'MEDIO_INCOMPLETO', 'MEDIO_COMPLETO', 'TECNICO_INCOMPLETO', 'TECNICO_COMPLETO', 'SUPERIOR_INCOMPLETO', 'SUPERIOR_COMPLETO', 'POS_GRADUACAO', 'MESTRADO', 'DOUTORADO');

-- CreateEnum
CREATE TYPE "Nivel" AS ENUM ('1', '2', '3', '4', '5');

-- CreateEnum
CREATE TYPE "Racacor" AS ENUM ('BRANCA', 'PRETA', 'PARDA', 'AMARELA', 'INDIGENA', 'NAO_DECLARADA');

-- CreateTable
CREATE TABLE "servidores" (
    "id_servidor" SERIAL NOT NULL,
    "matricula" VARCHAR(50) NOT NULL,
    "nome_completo" VARCHAR(150) NOT NULL,
    "nome_social" VARCHAR(150),
    "cpf" VARCHAR(11) NOT NULL,
    "rg" VARCHAR(30) NOT NULL,
    "data_nascimento" TIMESTAMP(3) NOT NULL,
    "nome_mae" VARCHAR(150) NOT NULL,
    "sexo" "Sexo" NOT NULL,
    "genero" "Genero" NOT NULL,
    "racacor" "Racacor" NOT NULL,
    "escolaridade" "Escolaridade" NOT NULL,
    "nivel" "Nivel" NOT NULL,

    CONSTRAINT "servidores_pkey" PRIMARY KEY ("id_servidor")
);

-- CreateIndex
CREATE UNIQUE INDEX "servidores_matricula_key" ON "servidores"("matricula");

-- CreateIndex
CREATE UNIQUE INDEX "servidores_cpf_key" ON "servidores"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "servidores_rg_key" ON "servidores"("rg");
