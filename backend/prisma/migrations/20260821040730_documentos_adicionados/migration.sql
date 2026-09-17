/*
  Warnings:

  - You are about to drop the `Racacor` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Servidores` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Zona` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[descricao]` on the table `Cargo` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[descricao]` on the table `Departamento` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[descricao]` on the table `Escolaridade` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nome]` on the table `Estado` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[descricao]` on the table `EstadoCivil` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[descricao]` on the table `Genero` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[descricao]` on the table `LocalizacaoDiferenciada` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nome,estado_id]` on the table `Municipio` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[descricao]` on the table `Nivel` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nome]` on the table `Pais` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[descricao]` on the table `Sexo` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[descricao]` on the table `Situacao` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[descricao]` on the table `TipoEnsinoMedioCursado` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[descricao]` on the table `TipoVinculo` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Servidores" DROP CONSTRAINT "Servidores_cargo_id_fkey";

-- DropForeignKey
ALTER TABLE "Servidores" DROP CONSTRAINT "Servidores_departamento_id_fkey";

-- DropForeignKey
ALTER TABLE "Servidores" DROP CONSTRAINT "Servidores_escolaridade_id_fkey";

-- DropForeignKey
ALTER TABLE "Servidores" DROP CONSTRAINT "Servidores_estado_civil_id_fkey";

-- DropForeignKey
ALTER TABLE "Servidores" DROP CONSTRAINT "Servidores_genero_id_fkey";

-- DropForeignKey
ALTER TABLE "Servidores" DROP CONSTRAINT "Servidores_localizacao_diferenciada_id_fkey";

-- DropForeignKey
ALTER TABLE "Servidores" DROP CONSTRAINT "Servidores_municipio_endereco_id_fkey";

-- DropForeignKey
ALTER TABLE "Servidores" DROP CONSTRAINT "Servidores_municipio_nascimento_id_fkey";

-- DropForeignKey
ALTER TABLE "Servidores" DROP CONSTRAINT "Servidores_nacionalidade_id_fkey";

-- DropForeignKey
ALTER TABLE "Servidores" DROP CONSTRAINT "Servidores_nivel_id_fkey";

-- DropForeignKey
ALTER TABLE "Servidores" DROP CONSTRAINT "Servidores_pais_nascimento_id_fkey";

-- DropForeignKey
ALTER TABLE "Servidores" DROP CONSTRAINT "Servidores_racacor_id_fkey";

-- DropForeignKey
ALTER TABLE "Servidores" DROP CONSTRAINT "Servidores_sexo_id_fkey";

-- DropForeignKey
ALTER TABLE "Servidores" DROP CONSTRAINT "Servidores_situacao_id_fkey";

-- DropForeignKey
ALTER TABLE "Servidores" DROP CONSTRAINT "Servidores_tipo_ensino_medio_cursado_id_fkey";

-- DropForeignKey
ALTER TABLE "Servidores" DROP CONSTRAINT "Servidores_tipo_vinculo_id_fkey";

-- DropForeignKey
ALTER TABLE "Servidores" DROP CONSTRAINT "Servidores_uf_endereco_id_fkey";

-- DropForeignKey
ALTER TABLE "Servidores" DROP CONSTRAINT "Servidores_zona_endereco_id_fkey";

-- DropTable
DROP TABLE "Racacor";

-- DropTable
DROP TABLE "Servidores";

-- DropTable
DROP TABLE "Zona";

-- CreateTable
CREATE TABLE "RacaCor" (
    "id_racacor" SERIAL NOT NULL,
    "descricao" VARCHAR(10) NOT NULL,

    CONSTRAINT "RacaCor_pkey" PRIMARY KEY ("id_racacor")
);

-- CreateTable
CREATE TABLE "ZonaEndereco" (
    "id_zona_endereco" SERIAL NOT NULL,
    "descricao" VARCHAR(10) NOT NULL,

    CONSTRAINT "ZonaEndereco_pkey" PRIMARY KEY ("id_zona_endereco")
);

-- CreateTable
CREATE TABLE "Funcao" (
    "id_funcao" SERIAL NOT NULL,
    "descricao" VARCHAR(50) NOT NULL,

    CONSTRAINT "Funcao_pkey" PRIMARY KEY ("id_funcao")
);

-- CreateTable
CREATE TABLE "RG" (
    "id_rg" SERIAL NOT NULL,
    "rg" VARCHAR(30) NOT NULL,
    "rg_orgao_emissor" VARCHAR(30) NOT NULL,
    "rg_uf_id" INTEGER NOT NULL,
    "rg_data_emissao" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RG_pkey" PRIMARY KEY ("id_rg")
);

-- CreateTable
CREATE TABLE "TituloEleitor" (
    "id_titulo_eleitor" SERIAL NOT NULL,
    "numero" VARCHAR(20) NOT NULL,
    "zona" VARCHAR(10) NOT NULL,
    "secao" VARCHAR(10) NOT NULL,

    CONSTRAINT "TituloEleitor_pkey" PRIMARY KEY ("id_titulo_eleitor")
);

-- CreateTable
CREATE TABLE "CTPS" (
    "id_ctps" SERIAL NOT NULL,
    "numero" VARCHAR(15) NOT NULL,
    "serie" VARCHAR(5) NOT NULL,
    "uf_ctps_id" INTEGER NOT NULL,
    "data_emissao" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CTPS_pkey" PRIMARY KEY ("id_ctps")
);

-- CreateTable
CREATE TABLE "CNH" (
    "id_cnh" SERIAL NOT NULL,
    "numero" VARCHAR(15) NOT NULL,
    "categoria" VARCHAR(15) NOT NULL,
    "data_emissao" TIMESTAMP(3) NOT NULL,
    "data_validade" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CNH_pkey" PRIMARY KEY ("id_cnh")
);

-- CreateTable
CREATE TABLE "CID" (
    "id_cid" SERIAL NOT NULL,
    "codigo" VARCHAR(10) NOT NULL,

    CONSTRAINT "CID_pkey" PRIMARY KEY ("id_cid")
);

-- CreateTable
CREATE TABLE "ServidorCid" (
    "id_servidor_cid" SERIAL NOT NULL,
    "servidor_id" INTEGER NOT NULL,
    "cid_id" INTEGER NOT NULL,

    CONSTRAINT "ServidorCid_pkey" PRIMARY KEY ("id_servidor_cid")
);

-- CreateTable
CREATE TABLE "Servidor" (
    "id_servidor" SERIAL NOT NULL,
    "matricula" VARCHAR(50) NOT NULL,
    "nome_completo" VARCHAR(150) NOT NULL,
    "nome_social" VARCHAR(150),
    "cpf" VARCHAR(11) NOT NULL,
    "rg_id" INTEGER NOT NULL,
    "nis_pis" VARCHAR(20) NOT NULL,
    "data_nascimento" TIMESTAMP(3) NOT NULL,
    "pais_nascimento_id" INTEGER NOT NULL,
    "municipio_nascimento_id" INTEGER,
    "nacionalidade_id" INTEGER NOT NULL,
    "ano_chegada_brasil" INTEGER,
    "cpf_mae" VARCHAR(11),
    "nome_mae" VARCHAR(150) NOT NULL,
    "cpf_pai" VARCHAR(11),
    "nome_pai" VARCHAR(150) NOT NULL,
    "estado_civil_id" INTEGER NOT NULL,
    "uniao_estavel" BOOLEAN NOT NULL DEFAULT false,
    "sexo_id" INTEGER NOT NULL,
    "genero_id" INTEGER NOT NULL,
    "racacor_id" INTEGER NOT NULL,
    "telefone_fixo" VARCHAR(11) NOT NULL,
    "telefone_movel" VARCHAR(11) NOT NULL,
    "email" VARCHAR(150) NOT NULL,
    "cep" VARCHAR(8) NOT NULL,
    "logradouro" VARCHAR(100) NOT NULL,
    "numero" VARCHAR(10),
    "complemento" VARCHAR(100),
    "bairro" VARCHAR(50) NOT NULL,
    "municipio_endereco_id" INTEGER NOT NULL,
    "zona_endereco_id" INTEGER NOT NULL,
    "localizacao_diferenciada_id" INTEGER,
    "titulo_eleitor_id" INTEGER NOT NULL,
    "ctps_id" INTEGER NOT NULL,
    "cnh_id" INTEGER NOT NULL,
    "cartao_sus" VARCHAR(20) NOT NULL,
    "admissao" TIMESTAMP(3) NOT NULL,
    "cargo_id" INTEGER NOT NULL,
    "funcao_id" INTEGER NOT NULL,
    "departamento_id" INTEGER NOT NULL,
    "tipo_vinculo_id" INTEGER NOT NULL,
    "escolaridade_id" INTEGER NOT NULL,
    "tipo_ensino_medio_cursado_id" INTEGER NOT NULL,
    "situacao_id" INTEGER NOT NULL,
    "nivel_id" INTEGER NOT NULL,

    CONSTRAINT "Servidor_pkey" PRIMARY KEY ("id_servidor")
);

-- CreateIndex
CREATE UNIQUE INDEX "RacaCor_descricao_key" ON "RacaCor"("descricao");

-- CreateIndex
CREATE UNIQUE INDEX "ZonaEndereco_descricao_key" ON "ZonaEndereco"("descricao");

-- CreateIndex
CREATE UNIQUE INDEX "Funcao_descricao_key" ON "Funcao"("descricao");

-- CreateIndex
CREATE UNIQUE INDEX "RG_rg_key" ON "RG"("rg");

-- CreateIndex
CREATE UNIQUE INDEX "TituloEleitor_numero_key" ON "TituloEleitor"("numero");

-- CreateIndex
CREATE UNIQUE INDEX "CTPS_numero_serie_uf_ctps_id_key" ON "CTPS"("numero", "serie", "uf_ctps_id");

-- CreateIndex
CREATE UNIQUE INDEX "CNH_numero_key" ON "CNH"("numero");

-- CreateIndex
CREATE UNIQUE INDEX "CID_codigo_key" ON "CID"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "ServidorCid_servidor_id_cid_id_key" ON "ServidorCid"("servidor_id", "cid_id");

-- CreateIndex
CREATE UNIQUE INDEX "Servidor_matricula_key" ON "Servidor"("matricula");

-- CreateIndex
CREATE UNIQUE INDEX "Servidor_cpf_key" ON "Servidor"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "Servidor_rg_id_key" ON "Servidor"("rg_id");

-- CreateIndex
CREATE UNIQUE INDEX "Servidor_nis_pis_key" ON "Servidor"("nis_pis");

-- CreateIndex
CREATE UNIQUE INDEX "Servidor_titulo_eleitor_id_key" ON "Servidor"("titulo_eleitor_id");

-- CreateIndex
CREATE UNIQUE INDEX "Servidor_ctps_id_key" ON "Servidor"("ctps_id");

-- CreateIndex
CREATE UNIQUE INDEX "Servidor_cnh_id_key" ON "Servidor"("cnh_id");

-- CreateIndex
CREATE UNIQUE INDEX "Cargo_descricao_key" ON "Cargo"("descricao");

-- CreateIndex
CREATE UNIQUE INDEX "Departamento_descricao_key" ON "Departamento"("descricao");

-- CreateIndex
CREATE UNIQUE INDEX "Escolaridade_descricao_key" ON "Escolaridade"("descricao");

-- CreateIndex
CREATE UNIQUE INDEX "Estado_nome_key" ON "Estado"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "EstadoCivil_descricao_key" ON "EstadoCivil"("descricao");

-- CreateIndex
CREATE UNIQUE INDEX "Genero_descricao_key" ON "Genero"("descricao");

-- CreateIndex
CREATE UNIQUE INDEX "LocalizacaoDiferenciada_descricao_key" ON "LocalizacaoDiferenciada"("descricao");

-- CreateIndex
CREATE UNIQUE INDEX "Municipio_nome_estado_id_key" ON "Municipio"("nome", "estado_id");

-- CreateIndex
CREATE UNIQUE INDEX "Nivel_descricao_key" ON "Nivel"("descricao");

-- CreateIndex
CREATE UNIQUE INDEX "Pais_nome_key" ON "Pais"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "Sexo_descricao_key" ON "Sexo"("descricao");

-- CreateIndex
CREATE UNIQUE INDEX "Situacao_descricao_key" ON "Situacao"("descricao");

-- CreateIndex
CREATE UNIQUE INDEX "TipoEnsinoMedioCursado_descricao_key" ON "TipoEnsinoMedioCursado"("descricao");

-- CreateIndex
CREATE UNIQUE INDEX "TipoVinculo_descricao_key" ON "TipoVinculo"("descricao");

-- AddForeignKey
ALTER TABLE "RG" ADD CONSTRAINT "RG_rg_uf_id_fkey" FOREIGN KEY ("rg_uf_id") REFERENCES "Estado"("id_estado") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CTPS" ADD CONSTRAINT "CTPS_uf_ctps_id_fkey" FOREIGN KEY ("uf_ctps_id") REFERENCES "Estado"("id_estado") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServidorCid" ADD CONSTRAINT "ServidorCid_servidor_id_fkey" FOREIGN KEY ("servidor_id") REFERENCES "Servidor"("id_servidor") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServidorCid" ADD CONSTRAINT "ServidorCid_cid_id_fkey" FOREIGN KEY ("cid_id") REFERENCES "CID"("id_cid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Servidor" ADD CONSTRAINT "Servidor_rg_id_fkey" FOREIGN KEY ("rg_id") REFERENCES "RG"("id_rg") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Servidor" ADD CONSTRAINT "Servidor_pais_nascimento_id_fkey" FOREIGN KEY ("pais_nascimento_id") REFERENCES "Pais"("id_pais") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Servidor" ADD CONSTRAINT "Servidor_municipio_nascimento_id_fkey" FOREIGN KEY ("municipio_nascimento_id") REFERENCES "Municipio"("id_municipio") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Servidor" ADD CONSTRAINT "Servidor_nacionalidade_id_fkey" FOREIGN KEY ("nacionalidade_id") REFERENCES "Pais"("id_pais") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Servidor" ADD CONSTRAINT "Servidor_estado_civil_id_fkey" FOREIGN KEY ("estado_civil_id") REFERENCES "EstadoCivil"("id_estado_civil") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Servidor" ADD CONSTRAINT "Servidor_sexo_id_fkey" FOREIGN KEY ("sexo_id") REFERENCES "Sexo"("id_sexo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Servidor" ADD CONSTRAINT "Servidor_genero_id_fkey" FOREIGN KEY ("genero_id") REFERENCES "Genero"("id_genero") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Servidor" ADD CONSTRAINT "Servidor_racacor_id_fkey" FOREIGN KEY ("racacor_id") REFERENCES "RacaCor"("id_racacor") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Servidor" ADD CONSTRAINT "Servidor_municipio_endereco_id_fkey" FOREIGN KEY ("municipio_endereco_id") REFERENCES "Municipio"("id_municipio") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Servidor" ADD CONSTRAINT "Servidor_zona_endereco_id_fkey" FOREIGN KEY ("zona_endereco_id") REFERENCES "ZonaEndereco"("id_zona_endereco") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Servidor" ADD CONSTRAINT "Servidor_localizacao_diferenciada_id_fkey" FOREIGN KEY ("localizacao_diferenciada_id") REFERENCES "LocalizacaoDiferenciada"("id_localizacao_diferenciada") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Servidor" ADD CONSTRAINT "Servidor_titulo_eleitor_id_fkey" FOREIGN KEY ("titulo_eleitor_id") REFERENCES "TituloEleitor"("id_titulo_eleitor") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Servidor" ADD CONSTRAINT "Servidor_ctps_id_fkey" FOREIGN KEY ("ctps_id") REFERENCES "CTPS"("id_ctps") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Servidor" ADD CONSTRAINT "Servidor_cnh_id_fkey" FOREIGN KEY ("cnh_id") REFERENCES "CNH"("id_cnh") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Servidor" ADD CONSTRAINT "Servidor_cargo_id_fkey" FOREIGN KEY ("cargo_id") REFERENCES "Cargo"("id_cargo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Servidor" ADD CONSTRAINT "Servidor_funcao_id_fkey" FOREIGN KEY ("funcao_id") REFERENCES "Funcao"("id_funcao") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Servidor" ADD CONSTRAINT "Servidor_departamento_id_fkey" FOREIGN KEY ("departamento_id") REFERENCES "Departamento"("id_departamento") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Servidor" ADD CONSTRAINT "Servidor_tipo_vinculo_id_fkey" FOREIGN KEY ("tipo_vinculo_id") REFERENCES "TipoVinculo"("id_tipo_vinculo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Servidor" ADD CONSTRAINT "Servidor_escolaridade_id_fkey" FOREIGN KEY ("escolaridade_id") REFERENCES "Escolaridade"("id_escolaridade") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Servidor" ADD CONSTRAINT "Servidor_tipo_ensino_medio_cursado_id_fkey" FOREIGN KEY ("tipo_ensino_medio_cursado_id") REFERENCES "TipoEnsinoMedioCursado"("id_tipo_ensino_medio_cursado") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Servidor" ADD CONSTRAINT "Servidor_situacao_id_fkey" FOREIGN KEY ("situacao_id") REFERENCES "Situacao"("id_situacao") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Servidor" ADD CONSTRAINT "Servidor_nivel_id_fkey" FOREIGN KEY ("nivel_id") REFERENCES "Nivel"("id_nivel") ON DELETE RESTRICT ON UPDATE CASCADE;
