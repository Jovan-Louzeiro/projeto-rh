-- CreateEnum
CREATE TYPE "SituacaoFerias" AS ENUM ('PENDENTE', 'APROVADA', 'CANCELADA');

-- CreateTable
CREATE TABLE "Ferias" (
    "id_ferias" SERIAL NOT NULL,
    "servidor_id" INTEGER NOT NULL,
    "matricula_id" INTEGER,
    "periodo_aquisitivo_inicio" DATE NOT NULL,
    "periodo_aquisitivo_fim" DATE NOT NULL,
    "dias_direito" INTEGER NOT NULL,
    "inicio" DATE NOT NULL,
    "fim" DATE NOT NULL,
    "dias" INTEGER NOT NULL,
    "abono_pecuniario" BOOLEAN NOT NULL DEFAULT false,
    "antecipacao_decimo_terceiro" BOOLEAN NOT NULL DEFAULT false,
    "observacoes" VARCHAR(1000),
    "situacao" "SituacaoFerias" NOT NULL DEFAULT 'PENDENTE',
    "aprovado_em" TIMESTAMP(3),
    "cancelado_em" TIMESTAMP(3),
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ferias_pkey" PRIMARY KEY ("id_ferias")
);

-- CreateIndex
CREATE INDEX "Ferias_servidor_id_idx" ON "Ferias"("servidor_id");

-- CreateIndex
CREATE INDEX "Ferias_situacao_idx" ON "Ferias"("situacao");

-- CreateIndex
CREATE INDEX "Ferias_inicio_fim_idx" ON "Ferias"("inicio", "fim");

-- AddForeignKey
ALTER TABLE "Ferias" ADD CONSTRAINT "Ferias_servidor_id_fkey" FOREIGN KEY ("servidor_id") REFERENCES "Servidor"("id_servidor") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ferias" ADD CONSTRAINT "Ferias_matricula_id_fkey" FOREIGN KEY ("matricula_id") REFERENCES "Matricula"("id_matricula") ON DELETE SET NULL ON UPDATE CASCADE;
