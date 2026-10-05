/*
  Warnings:

  - You are about to drop the `Nacionalidade` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Servidor" DROP CONSTRAINT "Servidor_nacionalidade_id_fkey";

-- DropTable
DROP TABLE "Nacionalidade";

-- AddForeignKey
ALTER TABLE "Servidor" ADD CONSTRAINT "Servidor_nacionalidade_id_fkey" FOREIGN KEY ("nacionalidade_id") REFERENCES "Pais"("id_pais") ON DELETE RESTRICT ON UPDATE CASCADE;
