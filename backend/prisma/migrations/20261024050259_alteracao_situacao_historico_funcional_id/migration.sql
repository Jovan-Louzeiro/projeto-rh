/*
  Warnings:

  - You are about to drop the column `situacao_id` on the `HistoricoFuncional` table. All the data in the column will be lost.
  - Added the required column `situacao_historico_funcional_id` to the `HistoricoFuncional` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "HistoricoFuncional" DROP CONSTRAINT "HistoricoFuncional_situacao_id_fkey";

-- AlterTable
ALTER TABLE "HistoricoFuncional" DROP COLUMN "situacao_id",
ADD COLUMN     "situacao_historico_funcional_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "HistoricoFuncional" ADD CONSTRAINT "HistoricoFuncional_situacao_historico_funcional_id_fkey" FOREIGN KEY ("situacao_historico_funcional_id") REFERENCES "Situacao"("id_situacao") ON DELETE RESTRICT ON UPDATE CASCADE;
