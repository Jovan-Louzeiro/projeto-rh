/*
  Warnings:

  - You are about to drop the column `tipo` on the `Identidade` table. All the data in the column will be lost.
  - Added the required column `tipo_identidade` to the `Identidade` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Identidade" DROP COLUMN "tipo",
ADD COLUMN     "tipo_identidade" "TipoIdentidade" NOT NULL,
ALTER COLUMN "numero" DROP NOT NULL;
