-- CreateEnum
CREATE TYPE "PermissaoUsuario" AS ENUM ('ADMIN', 'RH');

-- CreateTable
CREATE TABLE "Usuario" (
    "id_usuario" SERIAL NOT NULL,
    "nome" VARCHAR(50) NOT NULL,
    "email" VARCHAR(50) NOT NULL,
    "senha" TEXT NOT NULL,
    "permissao" "PermissaoUsuario" NOT NULL,
    "ativo" BOOLEAN NOT NULL,
    "servidor_id" INTEGER,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id_usuario")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_servidor_id_key" ON "Usuario"("servidor_id");

-- AddForeignKey
ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_servidor_id_fkey" FOREIGN KEY ("servidor_id") REFERENCES "Servidor"("id_servidor") ON DELETE SET NULL ON UPDATE CASCADE;
