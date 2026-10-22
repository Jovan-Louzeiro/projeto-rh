/*
  Warnings:

  - You are about to drop the column `tipo_vinculo_id` on the `HistoricoFuncional` table. All the data in the column will be lost.
  - Added the required column `tipo_vinculo_id` to the `Matricula` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "HistoricoFuncional" DROP CONSTRAINT "HistoricoFuncional_matricula_id_fkey";

-- DropForeignKey
ALTER TABLE "HistoricoFuncional" DROP CONSTRAINT "HistoricoFuncional_tipo_vinculo_id_fkey";

-- DropForeignKey
ALTER TABLE "Matricula" DROP CONSTRAINT "Matricula_servidor_id_fkey";

-- AlterTable
ALTER TABLE "HistoricoFuncional" DROP COLUMN "tipo_vinculo_id";

-- AlterTable
ALTER TABLE "Matricula" ADD COLUMN     "tipo_vinculo_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "HistoricoFuncional" ADD CONSTRAINT "HistoricoFuncional_matricula_id_fkey" FOREIGN KEY ("matricula_id") REFERENCES "Matricula"("id_matricula") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Matricula" ADD CONSTRAINT "Matricula_tipo_vinculo_id_fkey" FOREIGN KEY ("tipo_vinculo_id") REFERENCES "TipoVinculo"("id_tipo_vinculo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Matricula" ADD CONSTRAINT "Matricula_servidor_id_fkey" FOREIGN KEY ("servidor_id") REFERENCES "Servidor"("id_servidor") ON DELETE CASCADE ON UPDATE CASCADE;
