/*
  Warnings:

  - You are about to alter the column `descricao` on the `Genero` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(20)`.

*/
-- AlterTable
ALTER TABLE "Genero" ALTER COLUMN "descricao" SET DATA TYPE VARCHAR(20);
