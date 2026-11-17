-- CreateEnum
CREATE TYPE "SituacaoLicenca" AS ENUM ('PENDENTE', 'EM_ANALISE', 'APROVADA', 'REJEITADA', 'EM_ANDAMENTO', 'ENCERRADA', 'CANCELADA');

-- CreateTable
CREATE TABLE "Licenca" (
    "id_licenca" SERIAL NOT NULL,
    "servidor_id" INTEGER NOT NULL,
    "matricula_id" INTEGER,
    "tipo" VARCHAR(100) NOT NULL,
    "inicio" DATE NOT NULL,
    "termino" DATE,
    "sem_data_termino" BOOLEAN NOT NULL DEFAULT false,
    "dias" INTEGER,
    "previsao_retorno" DATE,
    "numero_documento" VARCHAR(100),
    "data_documento" DATE,
    "orgao_emissor" VARCHAR(150),
    "observacoes" VARCHAR(2000),
    "situacao" "SituacaoLicenca" NOT NULL DEFAULT 'PENDENTE',
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Licenca_pkey" PRIMARY KEY ("id_licenca")
);

-- CreateTable
CREATE TABLE "LicencaAnexo" (
    "id_anexo_licenca" SERIAL NOT NULL,
    "nome" VARCHAR(255) NOT NULL,
    "tipo" VARCHAR(100) NOT NULL,
    "tamanho" INTEGER NOT NULL,
    "conteudo" BYTEA NOT NULL,
    "enviado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "licenca_id" INTEGER NOT NULL,

    CONSTRAINT "LicencaAnexo_pkey" PRIMARY KEY ("id_anexo_licenca")
);

-- CreateIndex
CREATE INDEX "Licenca_servidor_id_idx" ON "Licenca"("servidor_id");

-- CreateIndex
CREATE INDEX "Licenca_situacao_idx" ON "Licenca"("situacao");

-- CreateIndex
CREATE INDEX "Licenca_inicio_termino_idx" ON "Licenca"("inicio", "termino");

-- CreateIndex
CREATE UNIQUE INDEX "LicencaAnexo_licenca_id_key" ON "LicencaAnexo"("licenca_id");

-- AddForeignKey
ALTER TABLE "Licenca" ADD CONSTRAINT "Licenca_servidor_id_fkey" FOREIGN KEY ("servidor_id") REFERENCES "Servidor"("id_servidor") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Licenca" ADD CONSTRAINT "Licenca_matricula_id_fkey" FOREIGN KEY ("matricula_id") REFERENCES "Matricula"("id_matricula") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LicencaAnexo" ADD CONSTRAINT "LicencaAnexo_licenca_id_fkey" FOREIGN KEY ("licenca_id") REFERENCES "Licenca"("id_licenca") ON DELETE CASCADE ON UPDATE CASCADE;
