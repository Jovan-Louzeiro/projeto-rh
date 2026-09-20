import { id } from "zod/locales";
import { prisma } from "../lib/prisma.js";
import { Dominio } from "./dominios.service.js";

const generoServices = new Dominio(
    prisma.genero,
    {
        nome: "Gênero",
        idField: "id_genero",
        verificacoesUso: []
    }
)

export async function listarGeneros() {
    return generoServices.listar()
}

export async function procurarGenero(id: number) {
    return generoServices.procurar(id)
}

export async function adicionarGenero(data: { descricao: string; ativo?: boolean }) {
    return generoServices.adicionar(data)
}

export async function atualizarGenero(id: number, data: { descricao: string; ativo?: boolean }) {
    return generoServices.atualizar(id, data)
}

export async function deletarGenero(id: number) {
    return generoServices.deletar(id)
}