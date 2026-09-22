-- AlterTable
ALTER TABLE "EstadoCivil" ADD COLUMN     "ativo" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "LocalizacaoDiferenciada" ADD COLUMN     "ativo" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Situacao" ADD COLUMN     "ativo" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "TipoEnsinoMedioCursado" ADD COLUMN     "ativo" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "TipoVinculo" ADD COLUMN     "ativo" BOOLEAN NOT NULL DEFAULT true;
