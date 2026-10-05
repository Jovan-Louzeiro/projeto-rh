/*
  Warnings:

  - You are about to alter the column `cartao_sus` on the `Servidor` table. The data in that column could be lost. The data in that column will be cast from `VarChar(20)` to `VarChar(15)`.

*/
-- AlterTable
ALTER TABLE "Departamento" ALTER COLUMN "descricao" SET DATA TYPE VARCHAR(150);

-- AlterTable
ALTER TABLE "Servidor" ALTER COLUMN "cartao_sus" SET DATA TYPE VARCHAR(15);
