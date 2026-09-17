/*
  Warnings:

  - You are about to drop the column `cargo_id` on the `Servidor` table. All the data in the column will be lost.
  - You are about to drop the column `cnh_id` on the `Servidor` table. All the data in the column will be lost.
  - You are about to drop the column `ctps_id` on the `Servidor` table. All the data in the column will be lost.
  - You are about to drop the column `departamento_id` on the `Servidor` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `Servidor` table. All the data in the column will be lost.
  - You are about to drop the column `funcao_id` on the `Servidor` table. All the data in the column will be lost.
  - You are about to drop the column `nivel_id` on the `Servidor` table. All the data in the column will be lost.
  - You are about to drop the column `pais_nascimento_id` on the `Servidor` table. All the data in the column will be lost.
  - You are about to drop the column `rg_id` on the `Servidor` table. All the data in the column will be lost.
  - You are about to drop the column `telefone_fixo` on the `Servidor` table. All the data in the column will be lost.
  - You are about to drop the column `telefone_movel` on the `Servidor` table. All the data in the column will be lost.
  - You are about to drop the column `tipo_vinculo_id` on the `Servidor` table. All the data in the column will be lost.
  - You are about to drop the column `titulo_eleitor_id` on the `Servidor` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[servidor_id]` on the table `CNH` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[servidor_id]` on the table `CTPS` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[servidor_id]` on the table `RG` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[rg,rg_orgao_emissor,rg_uf_id]` on the table `RG` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[cartao_sus]` on the table `Servidor` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[servidor_id]` on the table `TituloEleitor` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `servidor_id` to the `CNH` table without a default value. This is not possible if the table is not empty.
  - Added the required column `servidor_id` to the `CTPS` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tipo_ctps` to the `CTPS` table without a default value. This is not possible if the table is not empty.
  - Added the required column `servidor_id` to the `RG` table without a default value. This is not possible if the table is not empty.
  - Added the required column `servidor_id` to the `TituloEleitor` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TipoCTPS" AS ENUM ('ANTIGO', 'NOVO');

-- CreateEnum
CREATE TYPE "TipoCertidao" AS ENUM ('NASCIMENTO', 'CASAMENTO');

-- CreateEnum
CREATE TYPE "TipoContato" AS ENUM ('TELEFONE_FIXO', 'TELEFONE_MOVEL', 'EMAIL');

-- DropForeignKey
ALTER TABLE "CTPS" DROP CONSTRAINT "CTPS_uf_ctps_id_fkey";

-- DropForeignKey
ALTER TABLE "Servidor" DROP CONSTRAINT "Servidor_cargo_id_fkey";

-- DropForeignKey
ALTER TABLE "Servidor" DROP CONSTRAINT "Servidor_cnh_id_fkey";

-- DropForeignKey
ALTER TABLE "Servidor" DROP CONSTRAINT "Servidor_ctps_id_fkey";

-- DropForeignKey
ALTER TABLE "Servidor" DROP CONSTRAINT "Servidor_departamento_id_fkey";

-- DropForeignKey
ALTER TABLE "Servidor" DROP CONSTRAINT "Servidor_escolaridade_id_fkey";

-- DropForeignKey
ALTER TABLE "Servidor" DROP CONSTRAINT "Servidor_estado_civil_id_fkey";

-- DropForeignKey
ALTER TABLE "Servidor" DROP CONSTRAINT "Servidor_funcao_id_fkey";

-- DropForeignKey
ALTER TABLE "Servidor" DROP CONSTRAINT "Servidor_genero_id_fkey";

-- DropForeignKey
ALTER TABLE "Servidor" DROP CONSTRAINT "Servidor_nacionalidade_id_fkey";

-- DropForeignKey
ALTER TABLE "Servidor" DROP CONSTRAINT "Servidor_nivel_id_fkey";

-- DropForeignKey
ALTER TABLE "Servidor" DROP CONSTRAINT "Servidor_pais_nascimento_id_fkey";

-- DropForeignKey
ALTER TABLE "Servidor" DROP CONSTRAINT "Servidor_rg_id_fkey";

-- DropForeignKey
ALTER TABLE "Servidor" DROP CONSTRAINT "Servidor_tipo_ensino_medio_cursado_id_fkey";

-- DropForeignKey
ALTER TABLE "Servidor" DROP CONSTRAINT "Servidor_tipo_vinculo_id_fkey";

-- DropForeignKey
ALTER TABLE "Servidor" DROP CONSTRAINT "Servidor_titulo_eleitor_id_fkey";

-- DropIndex
DROP INDEX "RG_rg_key";

-- DropIndex
DROP INDEX "Servidor_cnh_id_key";

-- DropIndex
DROP INDEX "Servidor_ctps_id_key";

-- DropIndex
DROP INDEX "Servidor_rg_id_key";

-- DropIndex
DROP INDEX "Servidor_titulo_eleitor_id_key";

-- AlterTable
ALTER TABLE "CNH" ADD COLUMN     "servidor_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "CTPS" ADD COLUMN     "servidor_id" INTEGER NOT NULL,
ADD COLUMN     "tipo_ctps" "TipoCTPS" NOT NULL,
ALTER COLUMN "numero" DROP NOT NULL,
ALTER COLUMN "serie" DROP NOT NULL,
ALTER COLUMN "uf_ctps_id" DROP NOT NULL,
ALTER COLUMN "data_emissao" DROP NOT NULL;

-- AlterTable
ALTER TABLE "RG" ADD COLUMN     "servidor_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Servidor" DROP COLUMN "cargo_id",
DROP COLUMN "cnh_id",
DROP COLUMN "ctps_id",
DROP COLUMN "departamento_id",
DROP COLUMN "email",
DROP COLUMN "funcao_id",
DROP COLUMN "nivel_id",
DROP COLUMN "pais_nascimento_id",
DROP COLUMN "rg_id",
DROP COLUMN "telefone_fixo",
DROP COLUMN "telefone_movel",
DROP COLUMN "tipo_vinculo_id",
DROP COLUMN "titulo_eleitor_id",
ADD COLUMN     "observacao" VARCHAR(500),
ADD COLUMN     "pais_origem_id" INTEGER,
ALTER COLUMN "nis_pis" DROP NOT NULL,
ALTER COLUMN "estado_civil_id" DROP NOT NULL,
ALTER COLUMN "uniao_estavel" DROP NOT NULL,
ALTER COLUMN "genero_id" DROP NOT NULL,
ALTER COLUMN "cartao_sus" DROP NOT NULL,
ALTER COLUMN "escolaridade_id" DROP NOT NULL,
ALTER COLUMN "tipo_ensino_medio_cursado_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "TituloEleitor" ADD COLUMN     "servidor_id" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Nacionalidade" (
    "id_nacionalidade" SERIAL NOT NULL,
    "descricao" VARCHAR(15) NOT NULL,

    CONSTRAINT "Nacionalidade_pkey" PRIMARY KEY ("id_nacionalidade")
);

-- CreateTable
CREATE TABLE "Certidao" (
    "id_certidao" SERIAL NOT NULL,
    "nova_certidao" BOOLEAN NOT NULL,
    "matricula" VARCHAR(50) NOT NULL,
    "tipo_certidao" "TipoCertidao" NOT NULL,
    "termo" VARCHAR(5),
    "folha" VARCHAR(5),
    "livro" VARCHAR(5),
    "data_emissao" TIMESTAMP(3) NOT NULL,
    "servidor_id" INTEGER NOT NULL,

    CONSTRAINT "Certidao_pkey" PRIMARY KEY ("id_certidao")
);

-- CreateTable
CREATE TABLE "CursoFormacaoContinuada" (
    "id_curso_formacao_continuada" SERIAL NOT NULL,
    "descricao" VARCHAR(50) NOT NULL,

    CONSTRAINT "CursoFormacaoContinuada_pkey" PRIMARY KEY ("id_curso_formacao_continuada")
);

-- CreateTable
CREATE TABLE "ServidorCursoFormacaoContinuada" (
    "id_servidor_curso_formacao_continuada" SERIAL NOT NULL,
    "servidor_id" INTEGER NOT NULL,
    "curso_formacao_continuada_id" INTEGER NOT NULL,

    CONSTRAINT "ServidorCursoFormacaoContinuada_pkey" PRIMARY KEY ("id_servidor_curso_formacao_continuada")
);

-- CreateTable
CREATE TABLE "Contato" (
    "id_contato" SERIAL NOT NULL,
    "tipo_contato" "TipoContato" NOT NULL,
    "contato" VARCHAR(150) NOT NULL,
    "principal" BOOLEAN NOT NULL DEFAULT false,
    "servidor_id" INTEGER NOT NULL,

    CONSTRAINT "Contato_pkey" PRIMARY KEY ("id_contato")
);

-- CreateTable
CREATE TABLE "HistoricoFuncional" (
    "id_historico_funcional" SERIAL NOT NULL,
    "servidor_id" INTEGER NOT NULL,
    "cargo_id" INTEGER NOT NULL,
    "funcao_id" INTEGER,
    "departamento_id" INTEGER,
    "tipo_vinculo_id" INTEGER NOT NULL,
    "situacao_id" INTEGER NOT NULL,
    "data_inicio" TIMESTAMP(3) NOT NULL,
    "data_fim" TIMESTAMP(3),

    CONSTRAINT "HistoricoFuncional_pkey" PRIMARY KEY ("id_historico_funcional")
);

-- CreateIndex
CREATE UNIQUE INDEX "Nacionalidade_descricao_key" ON "Nacionalidade"("descricao");

-- CreateIndex
CREATE UNIQUE INDEX "Certidao_servidor_id_key" ON "Certidao"("servidor_id");

-- CreateIndex
CREATE UNIQUE INDEX "CursoFormacaoContinuada_descricao_key" ON "CursoFormacaoContinuada"("descricao");

-- CreateIndex
CREATE UNIQUE INDEX "ServidorCursoFormacaoContinuada_servidor_id_curso_formacao__key" ON "ServidorCursoFormacaoContinuada"("servidor_id", "curso_formacao_continuada_id");

-- CreateIndex
CREATE UNIQUE INDEX "CNH_servidor_id_key" ON "CNH"("servidor_id");

-- CreateIndex
CREATE UNIQUE INDEX "CTPS_servidor_id_key" ON "CTPS"("servidor_id");

-- CreateIndex
CREATE UNIQUE INDEX "RG_servidor_id_key" ON "RG"("servidor_id");

-- CreateIndex
CREATE UNIQUE INDEX "RG_rg_rg_orgao_emissor_rg_uf_id_key" ON "RG"("rg", "rg_orgao_emissor", "rg_uf_id");

-- CreateIndex
CREATE UNIQUE INDEX "Servidor_cartao_sus_key" ON "Servidor"("cartao_sus");

-- CreateIndex
CREATE UNIQUE INDEX "TituloEleitor_servidor_id_key" ON "TituloEleitor"("servidor_id");

-- AddForeignKey
ALTER TABLE "RG" ADD CONSTRAINT "RG_servidor_id_fkey" FOREIGN KEY ("servidor_id") REFERENCES "Servidor"("id_servidor") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TituloEleitor" ADD CONSTRAINT "TituloEleitor_servidor_id_fkey" FOREIGN KEY ("servidor_id") REFERENCES "Servidor"("id_servidor") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CTPS" ADD CONSTRAINT "CTPS_uf_ctps_id_fkey" FOREIGN KEY ("uf_ctps_id") REFERENCES "Estado"("id_estado") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CTPS" ADD CONSTRAINT "CTPS_servidor_id_fkey" FOREIGN KEY ("servidor_id") REFERENCES "Servidor"("id_servidor") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CNH" ADD CONSTRAINT "CNH_servidor_id_fkey" FOREIGN KEY ("servidor_id") REFERENCES "Servidor"("id_servidor") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Certidao" ADD CONSTRAINT "Certidao_servidor_id_fkey" FOREIGN KEY ("servidor_id") REFERENCES "Servidor"("id_servidor") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServidorCursoFormacaoContinuada" ADD CONSTRAINT "ServidorCursoFormacaoContinuada_servidor_id_fkey" FOREIGN KEY ("servidor_id") REFERENCES "Servidor"("id_servidor") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServidorCursoFormacaoContinuada" ADD CONSTRAINT "ServidorCursoFormacaoContinuada_curso_formacao_continuada__fkey" FOREIGN KEY ("curso_formacao_continuada_id") REFERENCES "CursoFormacaoContinuada"("id_curso_formacao_continuada") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contato" ADD CONSTRAINT "Contato_servidor_id_fkey" FOREIGN KEY ("servidor_id") REFERENCES "Servidor"("id_servidor") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistoricoFuncional" ADD CONSTRAINT "HistoricoFuncional_servidor_id_fkey" FOREIGN KEY ("servidor_id") REFERENCES "Servidor"("id_servidor") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistoricoFuncional" ADD CONSTRAINT "HistoricoFuncional_cargo_id_fkey" FOREIGN KEY ("cargo_id") REFERENCES "Cargo"("id_cargo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistoricoFuncional" ADD CONSTRAINT "HistoricoFuncional_funcao_id_fkey" FOREIGN KEY ("funcao_id") REFERENCES "Funcao"("id_funcao") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistoricoFuncional" ADD CONSTRAINT "HistoricoFuncional_departamento_id_fkey" FOREIGN KEY ("departamento_id") REFERENCES "Departamento"("id_departamento") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistoricoFuncional" ADD CONSTRAINT "HistoricoFuncional_tipo_vinculo_id_fkey" FOREIGN KEY ("tipo_vinculo_id") REFERENCES "TipoVinculo"("id_tipo_vinculo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistoricoFuncional" ADD CONSTRAINT "HistoricoFuncional_situacao_id_fkey" FOREIGN KEY ("situacao_id") REFERENCES "Situacao"("id_situacao") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Servidor" ADD CONSTRAINT "Servidor_nacionalidade_id_fkey" FOREIGN KEY ("nacionalidade_id") REFERENCES "Nacionalidade"("id_nacionalidade") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Servidor" ADD CONSTRAINT "Servidor_pais_origem_id_fkey" FOREIGN KEY ("pais_origem_id") REFERENCES "Pais"("id_pais") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Servidor" ADD CONSTRAINT "Servidor_estado_civil_id_fkey" FOREIGN KEY ("estado_civil_id") REFERENCES "EstadoCivil"("id_estado_civil") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Servidor" ADD CONSTRAINT "Servidor_genero_id_fkey" FOREIGN KEY ("genero_id") REFERENCES "Genero"("id_genero") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Servidor" ADD CONSTRAINT "Servidor_escolaridade_id_fkey" FOREIGN KEY ("escolaridade_id") REFERENCES "Escolaridade"("id_escolaridade") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Servidor" ADD CONSTRAINT "Servidor_tipo_ensino_medio_cursado_id_fkey" FOREIGN KEY ("tipo_ensino_medio_cursado_id") REFERENCES "TipoEnsinoMedioCursado"("id_tipo_ensino_medio_cursado") ON DELETE SET NULL ON UPDATE CASCADE;
