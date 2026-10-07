/*
  Warnings:

  - You are about to drop the column `ativo` on the `CNH` table. All the data in the column will be lost.
  - You are about to alter the column `numero` on the `CNH` table. The data in that column could be lost. The data in that column will be cast from `VarChar(15)` to `VarChar(11)`.
  - You are about to drop the column `ativo` on the `CTPS` table. All the data in the column will be lost.
  - You are about to drop the column `ativo` on the `Certidao` table. All the data in the column will be lost.
  - You are about to drop the column `tipo_ctps` on the `Servidor` table. All the data in the column will be lost.
  - You are about to drop the column `ativo` on the `TituloEleitor` table. All the data in the column will be lost.
  - You are about to drop the `RG` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `tipo_ctps` to the `CTPS` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TipoIdentidade" AS ENUM ('RG', 'CIN');

-- DropForeignKey
ALTER TABLE "CNH" DROP CONSTRAINT "CNH_servidor_id_fkey";

-- DropForeignKey
ALTER TABLE "CTPS" DROP CONSTRAINT "CTPS_servidor_id_fkey";

-- DropForeignKey
ALTER TABLE "Certidao" DROP CONSTRAINT "Certidao_servidor_id_fkey";

-- DropForeignKey
ALTER TABLE "RG" DROP CONSTRAINT "RG_rg_uf_id_fkey";

-- DropForeignKey
ALTER TABLE "RG" DROP CONSTRAINT "RG_servidor_id_fkey";

-- DropForeignKey
ALTER TABLE "TituloEleitor" DROP CONSTRAINT "TituloEleitor_servidor_id_fkey";

-- AlterTable
ALTER TABLE "CNH" DROP COLUMN "ativo",
ALTER COLUMN "numero" SET DATA TYPE VARCHAR(11);

-- AlterTable
ALTER TABLE "CTPS" DROP COLUMN "ativo",
ADD COLUMN     "tipo_ctps" "TipoCTPS" NOT NULL;

-- AlterTable
ALTER TABLE "Certidao" DROP COLUMN "ativo";

-- AlterTable
ALTER TABLE "Servidor" DROP COLUMN "tipo_ctps";

-- AlterTable
ALTER TABLE "TituloEleitor" DROP COLUMN "ativo";

-- DropTable
DROP TABLE "RG";

-- CreateTable
CREATE TABLE "Identidade" (
    "id_identidade" SERIAL NOT NULL,
    "tipo" "TipoIdentidade" NOT NULL,
    "numero" VARCHAR(30) NOT NULL,
    "orgao_emissor" VARCHAR(30) NOT NULL,
    "rg_uf_id" INTEGER NOT NULL,
    "rg_data_emissao" TIMESTAMP(3) NOT NULL,
    "servidor_id" INTEGER NOT NULL,

    CONSTRAINT "Identidade_pkey" PRIMARY KEY ("id_identidade")
);

-- CreateIndex
CREATE UNIQUE INDEX "Identidade_servidor_id_key" ON "Identidade"("servidor_id");

-- CreateIndex
CREATE UNIQUE INDEX "Identidade_numero_orgao_emissor_rg_uf_id_key" ON "Identidade"("numero", "orgao_emissor", "rg_uf_id");

-- AddForeignKey
ALTER TABLE "Certidao" ADD CONSTRAINT "Certidao_servidor_id_fkey" FOREIGN KEY ("servidor_id") REFERENCES "Servidor"("id_servidor") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CNH" ADD CONSTRAINT "CNH_servidor_id_fkey" FOREIGN KEY ("servidor_id") REFERENCES "Servidor"("id_servidor") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CTPS" ADD CONSTRAINT "CTPS_servidor_id_fkey" FOREIGN KEY ("servidor_id") REFERENCES "Servidor"("id_servidor") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Identidade" ADD CONSTRAINT "Identidade_rg_uf_id_fkey" FOREIGN KEY ("rg_uf_id") REFERENCES "Estado"("id_estado") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Identidade" ADD CONSTRAINT "Identidade_servidor_id_fkey" FOREIGN KEY ("servidor_id") REFERENCES "Servidor"("id_servidor") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TituloEleitor" ADD CONSTRAINT "TituloEleitor_servidor_id_fkey" FOREIGN KEY ("servidor_id") REFERENCES "Servidor"("id_servidor") ON DELETE CASCADE ON UPDATE CASCADE;
