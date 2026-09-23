import { PermissaoUsuario } from "../../generated/prisma/enums.js";

export type prismaModel = {
    findMany: Function;
    findUnique: Function;
    findFirst: Function;
    create: Function;
    update: Function;
    delete: Function;
}
export type AutorizacoesDominio = {
    listar: PermissaoUsuario[];
    procurar: PermissaoUsuario[];
    adicionar: PermissaoUsuario[];
    atualizar: PermissaoUsuario[];
    deletar: PermissaoUsuario[];
};

export type VerificacaoUso = {
    nome: string;
    verificar: (id: number) => Promise<number>;
};

export type DominioConfig = {
    prismaModel: prismaModel;
    nome: string;
    rota: string;
    idField: string;
    verificacoesUso: VerificacaoUso[];
    limiteDescricao: number;
    autorizacoes?: Partial<AutorizacoesDominio>;
};