CREATE TABLE "RequerimentoAnexo" (
    "id_anexo_requerimento" SERIAL NOT NULL,
    "nome" VARCHAR(255) NOT NULL,
    "tipo" VARCHAR(100) NOT NULL,
    "tamanho" INTEGER NOT NULL,
    "conteudo" BYTEA NOT NULL,
    "enviado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "requerimento_id" INTEGER NOT NULL,

    CONSTRAINT "RequerimentoAnexo_pkey" PRIMARY KEY ("id_anexo_requerimento")
);

CREATE INDEX "RequerimentoAnexo_requerimento_id_idx"
    ON "RequerimentoAnexo"("requerimento_id");

ALTER TABLE "RequerimentoAnexo"
    ADD CONSTRAINT "RequerimentoAnexo_requerimento_id_fkey"
    FOREIGN KEY ("requerimento_id")
    REFERENCES "Requerimento"("id_requerimento")
    ON DELETE CASCADE
    ON UPDATE CASCADE;
