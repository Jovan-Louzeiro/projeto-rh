-- CreateEnum
CREATE TYPE "SituacaoQuinquenio" AS ENUM ('AGUARDANDO_CONCESSAO', 'CONCEDIDO', 'IMPLANTADO', 'SUSPENSO', 'CANCELADO');

-- CreateTable
CREATE TABLE "Quinquenio" (
    "id_quinquenio" SERIAL NOT NULL,
    "servidor_id" INTEGER NOT NULL,
    "matricula_id" INTEGER,
    "numero" INTEGER NOT NULL,
    "data_admissao" DATE NOT NULL,
    "periodo_aquisitivo_inicio" DATE NOT NULL,
    "periodo_aquisitivo_fim" DATE NOT NULL,
    "data_aquisicao" DATE NOT NULL,
    "percentual_adicional" DOUBLE PRECISION NOT NULL,
    "valor_calculado" DOUBLE PRECISION NOT NULL,
    "data_inicio_pagamento" DATE NOT NULL,
    "situacao" "SituacaoQuinquenio" NOT NULL DEFAULT 'AGUARDANDO_CONCESSAO',
    "ato_numero" VARCHAR(100) NOT NULL,
    "ato_tipo" VARCHAR(100) NOT NULL,
    "ato_data" DATE NOT NULL,
    "observacoes" VARCHAR(2000),
    "cancelado_em" TIMESTAMP(3),
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Quinquenio_pkey" PRIMARY KEY ("id_quinquenio")
);

-- CreateTable
CREATE TABLE "QuinquenioAnexo" (
    "id_anexo_quinquenio" SERIAL NOT NULL,
    "nome" VARCHAR(255) NOT NULL,
    "tipo" VARCHAR(100) NOT NULL,
    "tamanho" INTEGER NOT NULL,
    "conteudo" BYTEA NOT NULL,
    "enviado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "quinquenio_id" INTEGER NOT NULL,

    CONSTRAINT "QuinquenioAnexo_pkey" PRIMARY KEY ("id_anexo_quinquenio")
);

-- CreateIndex
CREATE UNIQUE INDEX "Quinquenio_servidor_id_numero_key" ON "Quinquenio"("servidor_id", "numero");

-- CreateIndex
CREATE INDEX "Quinquenio_servidor_id_idx" ON "Quinquenio"("servidor_id");

-- CreateIndex
CREATE INDEX "Quinquenio_situacao_idx" ON "Quinquenio"("situacao");

-- CreateIndex
CREATE INDEX "Quinquenio_data_aquisicao_data_inicio_pagamento_idx" ON "Quinquenio"("data_aquisicao", "data_inicio_pagamento");

-- CreateIndex
CREATE UNIQUE INDEX "QuinquenioAnexo_quinquenio_id_key" ON "QuinquenioAnexo"("quinquenio_id");

-- AddForeignKey
ALTER TABLE "Quinquenio" ADD CONSTRAINT "Quinquenio_servidor_id_fkey" FOREIGN KEY ("servidor_id") REFERENCES "Servidor"("id_servidor") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quinquenio" ADD CONSTRAINT "Quinquenio_matricula_id_fkey" FOREIGN KEY ("matricula_id") REFERENCES "Matricula"("id_matricula") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuinquenioAnexo" ADD CONSTRAINT "QuinquenioAnexo_quinquenio_id_fkey" FOREIGN KEY ("quinquenio_id") REFERENCES "Quinquenio"("id_quinquenio") ON DELETE CASCADE ON UPDATE CASCADE;
