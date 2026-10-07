import { PermissaoUsuario } from "../../generated/prisma/enums.js";
import { ZodType } from "zod";

export const autorizacoesPadrao: Autorizacoes = {
    listar: [PermissaoUsuario.RH, PermissaoUsuario.ADMIN],
    procurar: [PermissaoUsuario.RH, PermissaoUsuario.ADMIN],
    adicionar: [PermissaoUsuario.ADMIN],
    atualizar: [PermissaoUsuario.ADMIN],
    deletar: [PermissaoUsuario.ADMIN],
};
export interface CrudSchema {
    params: ZodType;
    adicionar: ZodType;
    atualizar: ZodType;
}

export interface DocumentosSchemas {
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