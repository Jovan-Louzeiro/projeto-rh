-- AlterTable
ALTER TABLE "Servidor" ADD COLUMN     "comunidade_indigena_id" INTEGER;

-- CreateTable
CREATE TABLE "ComunidadeIndigena" (
    "id_comunidade_indigena" SERIAL NOT NULL,
    "descricao" VARCHAR(50) NOT NULL,

    CONSTRAINT "ComunidadeIndigena_pkey" PRIMARY KEY ("id_comunidade_indigena")
);

-- CreateIndex
CREATE UNIQUE INDEX "ComunidadeIndigena_descricao_key" ON "ComunidadeIndigena"("descricao");

-- AddForeignKey
ALTER TABLE "Servidor" ADD CONSTRAINT "Servidor_comunidade_indigena_id_fkey" FOREIGN KEY ("comunidade_indigena_id") REFERENCES "ComunidadeIndigena"("id_comunidade_indigena") ON DELETE SET NULL ON UPDATE CASCADE;
