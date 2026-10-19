/*
  Warnings:

  - You are about to drop the column `servidor_id` on the `HistoricoFuncional` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "HistoricoFuncional" DROP CONSTRAINT "HistoricoFuncional_servidor_id_fkey";

-- AlterTable
ALTER TABLE "HistoricoFuncional" DROP COLUMN "servidor_id";
