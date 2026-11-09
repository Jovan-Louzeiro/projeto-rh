/*
  Warnings:

  - A unique constraint covering the columns `[numero_protocolo]` on the table `Requerimento` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `dados_historicos` to the `Requerimento` table without a default value. This is not possible if the table is not empty.
  - Added the required column `matricula_id` to the `Requerimento` table without a default value. This is not possible if the table is not empty.
  - Added the required column `numero_protocolo` to the `Requerimento` table without a default value. This is not possible if the table is not empty.
  - Added the required column `servidor_id` to the `Requerimento` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tipo_requerimento_id` to the `Requerimento` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Requerimento" ADD COLUMN     "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "dados_historicos" JSONB NOT NULL,
ADD COLUMN     "matricula_id" INTEGER NOT NULL,
ADD COLUMN     "numero_protocolo" TEXT NOT NULL,
ADD COLUMN     "servidor_id" INTEGER NOT NULL,
ADD COLUMN     "tipo_requerimento_id" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "TipoRequerimento" (
    "id_tipo_requerimento" SERIAL NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "descricao" VARCHAR(50) NOT NULL,

    CONSTRAINT "TipoRequerimento_pkey" PRIMARY KEY ("id_tipo_requerimento")
);

-- CreateIndex
CREATE UNIQUE INDEX "Requerimento_numero_protocolo_key" ON "Requerimento"("numero_protocolo");

-- AddForeignKey
ALTER TABLE "Requerimento" ADD CONSTRAINT "Requerimento_tipo_requerimento_id_fkey" FOREIGN KEY ("tipo_requerimento_id") REFERENCES "TipoRequerimento"("id_tipo_requerimento") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Requerimento" ADD CONSTRAINT "Requerimento_servidor_id_fkey" FOREIGN KEY ("servidor_id") REFERENCES "Servidor"("id_servidor") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Requerimento" ADD CONSTRAINT "Requerimento_matricula_id_fkey" FOREIGN KEY ("matricula_id") REFERENCES "Matricula"("id_matricula") ON DELETE RESTRICT ON UPDATE CASCADE;
