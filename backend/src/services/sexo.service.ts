import { prisma } from "../lib/prisma.js";
import { Dominio } from "./dominios.service.js";

const sexoServices = new Dominio(
    prisma.sexo,
    {
        nome: "Sexo",
        idField: "id_sexo",
        verificacoesUso: []
    }    
)

//  Pesquisar todos Sexoes
export async function listarSexos() {
    return sexoServices.listar()
}

// Procurar um Sexo

export async function procurarSexo(id: number) {
    return sexoServices.procurar(id)
}

// Adicionar uma Raca/Cor
export async function adicionarSexo(data: { descricao: string, ativo?: boolean }) {
    return sexoServices.adicionar(data)
}

export async function atualizarSexo(id: number, data: { descricao?: string, ativo?: boolean }) {
    return sexoServices.atualizar(id, data)
}

export async function deletarSexo(id: number) {
    return sexoServices.deletar(id)
}