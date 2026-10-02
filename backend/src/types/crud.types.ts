import { PermissaoUsuario } from "../../generated/prisma/enums.js";
import { ZodType } from "zod";

export interface CrudSchema {
    params: ZodType;
    adicionar: ZodType;
    atualizar: ZodType;
}

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