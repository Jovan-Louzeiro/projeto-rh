/*
  Warnings:

  - Added the required column `estado_civil_id` to the `Servidores` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Servidores" ADD COLUMN     "cpf_mae" VARCHAR(11),
ADD COLUMN     "cpf_pai" VARCHAR(11),
ADD COLUMN     "estado_civil_id" INTEGER NOT NULL,
ADD COLUMN     "uniao_estavel" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "EstadoCivil" (
    "id_estado_civil" SERIAL NOT NULL,
    "descricao" VARCHAR(15) NOT NULL,

    CONSTRAINT "EstadoCivil_pkey" PRIMARY KEY ("id_estado_civil")
);

-- AddForeignKey
ALTER TABLE "Servidores" ADD CONSTRAINT "Servidores_estado_civil_id_fkey" FOREIGN KEY ("estado_civil_id") REFERENCES "EstadoCivil"("id_estado_civil") ON DELETE RESTRICT ON UPDATE CASCADE;
