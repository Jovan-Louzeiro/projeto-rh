/*
  Warnings:

  - You are about to drop the column `tipo_ctps` on the `CTPS` table. All the data in the column will be lost.
  - You are about to alter the column `numero` on the `TituloEleitor` table. The data in that column could be lost. The data in that column will be cast from `VarChar(20)` to `VarChar(12)`.
  - You are about to alter the column `zona` on the `TituloEleitor` table. The data in that column could be lost. The data in that column will be cast from `VarChar(10)` to `VarChar(4)`.
  - You are about to alter the column `secao` on the `TituloEleitor` table. The data in that column could be lost. The data in that column will be cast from `VarChar(10)` to `VarChar(4)`.
  - Made the column `data_emissao` on table `CTPS` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "CTPS" DROP COLUMN "tipo_ctps",
ALTER COLUMN "data_emissao" SET NOT NULL;

-- AlterTable
ALTER TABLE "Servidor" ADD COLUMN     "tipo_ctps" "TipoCTPS";

-- AlterTable
ALTER TABLE "TituloEleitor" ALTER COLUMN "numero" SET DATA TYPE VARCHAR(12),
ALTER COLUMN "zona" SET DATA TYPE VARCHAR(4),
ALTER COLUMN "secao" SET DATA TYPE VARCHAR(4);
