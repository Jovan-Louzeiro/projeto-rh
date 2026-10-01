import { PermissaoUsuario } from "../../generated/prisma/enums.js";

export type Autorizacoes = {
    listar: PermissaoUsuario[];
    procurar: PermissaoUsuario[];
    adicionar: PermissaoUsuario[];
    atualizar: PermissaoUsuario[];
    deletar: PermissaoUsuario[];
};

export type prismaModel = {
    findMany: Function;
    findUnique: Function;
    findFirst: Function;
    create: Function;
    update: Function;
    delete: Function;
}