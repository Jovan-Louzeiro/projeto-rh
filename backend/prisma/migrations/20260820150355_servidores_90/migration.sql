/*
  Warnings:

  - You are about to drop the column `telefone` on the `Servidores` table. All the data in the column will be lost.
  - You are about to alter the column `cep` on the `Servidores` table. The data in that column could be lost. The data in that column will be cast from `VarChar` to `VarChar(8)`.
  - Added the required column `admissao` to the `Servidores` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ano_chegada_brasil` to the `Servidores` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bairro` to the `Servidores` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cargo_id` to the `Servidores` table without a default value. This is not possible if the table is not empty.
  - Added the required column `departamento_id` to the `Servidores` table without a default value. This is not possible if the table is not empty.
  - Added the required column `logradouro` to the `Servidores` table without a default value. This is not possible if the table is not empty.
  - Added the required column `municipio_endereco_id` to the `Servidores` table without a default value. This is not possible if the table is not empty.
  - Added the required column `municipio_nascimento_id` to the `Servidores` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nacionalidade_id` to the `Servidores` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pais_nascimento_id` to the `Servidores` table without a default value. This is not possible if the table is not empty.
  - Added the required column `situacao_id` to the `Servidores` table without a default value. This is not possible if the table is not empty.
  - Added the required column `telefone_fixo` to the `Servidores` table without a default value. This is not possible if the table is not empty.
  - Added the required column `telefone_movel` to the `Servidores` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tipo_ensino_medio_cursado_id` to the `Servidores` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tipo_vinculo_id` to the `Servidores` table without a default value. This is not possible if the table is not empty.
  - Added the required column `uf_endereco_id` to the `Servidores` table without a default value. This is not possible if the table is not empty.
  - Added the required column `zona_endereco_id` to the `Servidores` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Servidores" DROP COLUMN "telefone",
ADD COLUMN     "admissao" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "ano_chegada_brasil" INTEGER NOT NULL,
ADD COLUMN     "bairro" VARCHAR(50) NOT NULL,
ADD COLUMN     "cargo_id" INTEGER NOT NULL,
ADD COLUMN     "complemento" VARCHAR(100),
ADD COLUMN     "departamento_id" INTEGER NOT NULL,
ADD COLUMN     "localizacao_diferenciada_id" INTEGER,
ADD COLUMN     "logradouro" VARCHAR(100) NOT NULL,
ADD COLUMN     "municipio_endereco_id" INTEGER NOT NULL,
ADD COLUMN     "municipio_nascimento_id" INTEGER NOT NULL,
ADD COLUMN     "nacionalidade_id" INTEGER NOT NULL,
ADD COLUMN     "numero" VARCHAR(10),
ADD COLUMN     "pais_nascimento_id" INTEGER NOT NULL,
ADD COLUMN     "situacao_id" INTEGER NOT NULL,
ADD COLUMN     "telefone_fixo" VARCHAR(11) NOT NULL,
ADD COLUMN     "telefone_movel" VARCHAR(11) NOT NULL,
ADD COLUMN     "tipo_ensino_medio_cursado_id" INTEGER NOT NULL,
ADD COLUMN     "tipo_vinculo_id" INTEGER NOT NULL,
ADD COLUMN     "uf_endereco_id" INTEGER NOT NULL,
ADD COLUMN     "zona_endereco_id" INTEGER NOT NULL,
ALTER COLUMN "cep" SET DATA TYPE VARCHAR(8);

-- CreateTable
CREATE TABLE "Pais" (
    "id_pais" SERIAL NOT NULL,
    "nome" VARCHAR(100) NOT NULL,
    "gentilico" VARCHAR(100) NOT NULL,
    "codigo_iso" CHAR(2) NOT NULL,

    CONSTRAINT "Pais_pkey" PRIMARY KEY ("id_pais")
);

-- CreateTable
CREATE TABLE "Estado" (
    "id_estado" SERIAL NOT NULL,
    "nome" VARCHAR(100) NOT NULL,
    "uf" CHAR(2) NOT NULL,
    "pais_id" INTEGER NOT NULL,

    CONSTRAINT "Estado_pkey" PRIMARY KEY ("id_estado")
);

-- CreateTable
CREATE TABLE "Municipio" (
    "id_municipio" SERIAL NOT NULL,
    "nome" VARCHAR(100) NOT NULL,
    "estado_id" INTEGER NOT NULL,

    CONSTRAINT "Municipio_pkey" PRIMARY KEY ("id_municipio")
);

-- CreateTable
CREATE TABLE "Zona" (
    "id_zona" SERIAL NOT NULL,
    "descricao" VARCHAR(10) NOT NULL,

    CONSTRAINT "Zona_pkey" PRIMARY KEY ("id_zona")
);

-- CreateTable
CREATE TABLE "LocalizacaoDiferenciada" (
    "id_localizacao_diferenciada" SERIAL NOT NULL,
    "descricao" VARCHAR(50) NOT NULL,

    CONSTRAINT "LocalizacaoDiferenciada_pkey" PRIMARY KEY ("id_localizacao_diferenciada")
);

-- CreateTable
CREATE TABLE "Cargo" (
    "id_cargo" SERIAL NOT NULL,
    "descricao" VARCHAR(50) NOT NULL,

    CONSTRAINT "Cargo_pkey" PRIMARY KEY ("id_cargo")
);

-- CreateTable
CREATE TABLE "Departamento" (
    "id_departamento" SERIAL NOT NULL,
    "descricao" VARCHAR(50) NOT NULL,

    CONSTRAINT "Departamento_pkey" PRIMARY KEY ("id_departamento")
);

-- CreateTable
CREATE TABLE "TipoVinculo" (
    "id_tipo_vinculo" SERIAL NOT NULL,
    "descricao" VARCHAR(50) NOT NULL,

    CONSTRAINT "TipoVinculo_pkey" PRIMARY KEY ("id_tipo_vinculo")
);

-- CreateTable
CREATE TABLE "TipoEnsinoMedioCursado" (
    "id_tipo_ensino_medio_cursado" SERIAL NOT NULL,
    "descricao" VARCHAR(50) NOT NULL,

    CONSTRAINT "TipoEnsinoMedioCursado_pkey" PRIMARY KEY ("id_tipo_ensino_medio_cursado")
);

-- CreateTable
CREATE TABLE "Situacao" (
    "id_situacao" SERIAL NOT NULL,
    "descricao" VARCHAR(30) NOT NULL,

    CONSTRAINT "Situacao_pkey" PRIMARY KEY ("id_situacao")
);

-- CreateIndex
CREATE UNIQUE INDEX "Pais_codigo_iso_key" ON "Pais"("codigo_iso");

-- CreateIndex
CREATE UNIQUE INDEX "Estado_uf_key" ON "Estado"("uf");

-- AddForeignKey
ALTER TABLE "Estado" ADD CONSTRAINT "Estado_pais_id_fkey" FOREIGN KEY ("pais_id") REFERENCES "Pais"("id_pais") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Municipio" ADD CONSTRAINT "Municipio_estado_id_fkey" FOREIGN KEY ("estado_id") REFERENCES "Estado"("id_estado") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Servidores" ADD CONSTRAINT "Servidores_pais_nascimento_id_fkey" FOREIGN KEY ("pais_nascimento_id") REFERENCES "Pais"("id_pais") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Servidores" ADD CONSTRAINT "Servidores_municipio_nascimento_id_fkey" FOREIGN KEY ("municipio_nascimento_id") REFERENCES "Municipio"("id_municipio") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Servidores" ADD CONSTRAINT "Servidores_nacionalidade_id_fkey" FOREIGN KEY ("nacionalidade_id") REFERENCES "Pais"("id_pais") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Servidores" ADD CONSTRAINT "Servidores_uf_endereco_id_fkey" FOREIGN KEY ("uf_endereco_id") REFERENCES "Estado"("id_estado") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Servidores" ADD CONSTRAINT "Servidores_municipio_endereco_id_fkey" FOREIGN KEY ("municipio_endereco_id") REFERENCES "Municipio"("id_municipio") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Servidores" ADD CONSTRAINT "Servidores_zona_endereco_id_fkey" FOREIGN KEY ("zona_endereco_id") REFERENCES "Zona"("id_zona") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Servidores" ADD CONSTRAINT "Servidores_localizacao_diferenciada_id_fkey" FOREIGN KEY ("localizacao_diferenciada_id") REFERENCES "LocalizacaoDiferenciada"("id_localizacao_diferenciada") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Servidores" ADD CONSTRAINT "Servidores_cargo_id_fkey" FOREIGN KEY ("cargo_id") REFERENCES "Cargo"("id_cargo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Servidores" ADD CONSTRAINT "Servidores_departamento_id_fkey" FOREIGN KEY ("departamento_id") REFERENCES "Departamento"("id_departamento") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Servidores" ADD CONSTRAINT "Servidores_tipo_vinculo_id_fkey" FOREIGN KEY ("tipo_vinculo_id") REFERENCES "TipoVinculo"("id_tipo_vinculo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Servidores" ADD CONSTRAINT "Servidores_tipo_ensino_medio_cursado_id_fkey" FOREIGN KEY ("tipo_ensino_medio_cursado_id") REFERENCES "TipoEnsinoMedioCursado"("id_tipo_ensino_medio_cursado") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Servidores" ADD CONSTRAINT "Servidores_situacao_id_fkey" FOREIGN KEY ("situacao_id") REFERENCES "Situacao"("id_situacao") ON DELETE RESTRICT ON UPDATE CASCADE;
