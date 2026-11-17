CREATE TYPE "TipoDocumentoDigitalizado" AS ENUM (
    'CERTIDAO',
    'CNH',
    'CTPS',
    'IDENTIDADE',
    'TITULO_ELEITOR'
);

CREATE TABLE "DocumentoDigitalizadoServidor" (
    "id_documento_digitalizado" SERIAL NOT NULL,
    "servidor_id" INTEGER NOT NULL,
    "tipo" "TipoDocumentoDigitalizado" NOT NULL,
    "nome" VARCHAR(255) NOT NULL,
    "mime_type" VARCHAR(100) NOT NULL,
    "tamanho" INTEGER NOT NULL,
    "conteudo" BYTEA NOT NULL,
    "enviado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DocumentoDigitalizadoServidor_pkey" PRIMARY KEY ("id_documento_digitalizado")
);

CREATE UNIQUE INDEX "DocumentoDigitalizadoServidor_servidor_id_tipo_key"
    ON "DocumentoDigitalizadoServidor"("servidor_id", "tipo");

ALTER TABLE "DocumentoDigitalizadoServidor"
    ADD CONSTRAINT "DocumentoDigitalizadoServidor_servidor_id_fkey"
    FOREIGN KEY ("servidor_id")
    REFERENCES "Servidor"("id_servidor")
    ON DELETE CASCADE
    ON UPDATE CASCADE;
