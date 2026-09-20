import { prisma } from "../lib/prisma.js";
import { Dominio } from "./dominios.service.js";

const racaCorServices = new Dominio(
    prisma.racaCor,
    {
        nome: "Raça/Cor",
        idField: "id_racacor",
        verificacoesUso: []
    }    
)

//  Pesquisar todos RacaCores
export async function listarRacaCores() {
    return racaCorServices.listar()
}

// Procurar um racaCor

export async function procurarRacaCor(id: number) {
    return racaCorServices.procurar(id)
}

// Adicionar uma Raca/Cor
export async function adicionarRacaCor(data: { descricao: string, ativo?: boolean }) {
    return racaCorServices.adicionar(data)
}

export async function atualizarRacaCor(id: number, data: { descricao?: string, ativo?: boolean }) {
    return racaCorServices.atualizar(id, data)
}

export async function deletarRacaCor(id: number) {
    return racaCorServices.deletar(id)
}