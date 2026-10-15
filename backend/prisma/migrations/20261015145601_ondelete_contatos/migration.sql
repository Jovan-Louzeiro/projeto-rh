/*
  Warnings:

  - A unique constraint covering the columns `[contato]` on the table `Contato` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Contato" DROP CONSTRAINT "Contato_servidor_id_fkey";

-- CreateIndex
CREATE UNIQUE INDEX "Contato_contato_key" ON "Contato"("contato");

-- AddForeignKey
ALTER TABLE "Contato" ADD CONSTRAINT "Contato_servidor_id_fkey" FOREIGN KEY ("servidor_id") REFERENCES "Servidor"("id_servidor") ON DELETE CASCADE ON UPDATE CASCADE;
