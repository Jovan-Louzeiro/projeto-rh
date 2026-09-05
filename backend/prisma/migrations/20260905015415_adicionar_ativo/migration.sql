/*
  Warnings:

  - You are about to drop the column `admissao` on the `Servidor` table. All the data in the column will be lost.
  - You are about to drop the column `matricula` on the `Servidor` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[inep]` on the table `Departamento` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `matricula_id` to the `HistoricoFuncional` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Servidor_matricula_key";

-- AlterTable
ALTER TABLE "Cargo" ADD COLUMN     "ativo" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "ComunidadeIndigena" ADD COLUMN     "ativo" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Departamento" ADD COLUMN     "ativo" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "inep" VARCHAR(50);

-- AlterTable
ALTER TABLE "Escolaridade" ADD COLUMN     "ativo" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Funcao" ADD COLUMN     "ativo" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Genero" ADD COLUMN     "ativo" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "HistoricoFuncional" ADD COLUMN     "matricula_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Nivel" ADD COLUMN     "ativo" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "RacaCor" ADD COLUMN     "ativo" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Servidor" DROP COLUMN "admissao",
DROP COLUMN "matricula";

-- AlterTable
ALTER TABLE "Sexo" ADD COLUMN     "ativo" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "ZonaEndereco" ADD COLUMN     "ativo" BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE "Matricula" (
    "id_matricula" SERIAL NOT NULL,
    "numero" VARCHAR(50) NOT NULL,
    "admissao" TIMESTAMP(3) NOT NULL,
    "servidor_id" INTEGER NOT NULL,

    CONSTRAINT "Matricula_pkey" PRIMARY KEY ("id_matricula")
);

-- CreateTable
CREATE TABLE "TiposLicenca" (
    "id_tipos_licenca" SERIAL NOT NULL,
    "descricao" VARCHAR(50) NOT NULL,

    CONSTRAINT "TiposLicenca_pkey" PRIMARY KEY ("id_tipos_licenca")
);

-- CreateTable
CREATE TABLE "Requerimento" (
    "id_requerimento" SERIAL NOT NULL,

    CONSTRAINT "Requerimento_pkey" PRIMARY KEY ("id_requerimento")
);

-- CreateIndex
CREATE UNIQUE INDEX "Matricula_numero_key" ON "Matricula"("numero");

-- CreateIndex
CREATE UNIQUE INDEX "Departamento_inep_key" ON "Departamento"("inep");

-- AddForeignKey
ALTER TABLE "HistoricoFuncional" ADD CONSTRAINT "HistoricoFuncional_matricula_id_fkey" FOREIGN KEY ("matricula_id") REFERENCES "Matricula"("id_matricula") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Matricula" ADD CONSTRAINT "Matricula_servidor_id_fkey" FOREIGN KEY ("servidor_id") REFERENCES "Servidor"("id_servidor") ON DELETE RESTRICT ON UPDATE CASCADE;
