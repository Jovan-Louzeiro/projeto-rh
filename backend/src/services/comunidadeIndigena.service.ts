import { id } from "zod/locales";
import { prisma } from "../lib/prisma.js";
import { Dominio } from "./dominios.service.js";

const ComunidadeIndigenaServices = new Dominio(
    prisma.comunidadeIndigena,
    {
        nome: "Gênero",
        idField: "id_comunidade_indigena",
        verificacoesUso: []
    }
)

export async function listarComunidadesIndigenas() {
    return ComunidadeIndigenaServices.listar()
}

export async function procurarComunidadeIndigena(id: number) {
    return ComunidadeIndigenaServices.procurar(id)
}

export async function adicionarComunidadeIndigena(data: { descricao: string; ativo?: boolean }) {
    return ComunidadeIndigenaServices.adicionar(data)
}

export async function atualizarComunidadeIndigena(id: number, data: { descricao: string; ativo?: boolean }) {
    return ComunidadeIndigenaServices.atualizar(id, data)
}

export async function deletarComunidadeIndigena(id: number) {
    return ComunidadeIndigenaServices.deletar(id)
}