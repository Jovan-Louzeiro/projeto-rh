import { prisma } from "../lib/prisma.js";
import { RegistroEmUso, RegistroJaExistenteError, RegistroNaoEncontradoError } from "../errors/dominios.errors.js";

const prismaModel = prisma.racaCor

//  Pesquisar todos RacaCores
export async function listarRacaCores() {
    return await prismaModel.findMany()
}

// Procurar um racaCor

export async function procurarRacaCor(id: number){
    
    const resultado = await prismaModel.findUnique({
        where: {
            id_racacor: id
        }
    })

    if(!resultado){
        throw new RegistroNaoEncontradoError("Raca/Cor")
    }

    return resultado
}

// Adicionar uma Raca/Cor
export async function adicionarRacaCor(data:{ descricao: string, ativo?: boolean}) {

    const racaCorExiste = await prismaModel.findUnique({
        where: {
            descricao: data.descricao
        }
    })
    
    if(racaCorExiste){
        throw new RegistroJaExistenteError("Raca/Cor")
    }

    return await prismaModel.create({
        data: {
            descricao: data.descricao,
            ativo: data.ativo ?? true
        }
    })

}

export async function deletarRacaCor(id:number) {

    const existeId = await prismaModel.findUnique({
        where: {
            id_racacor: id
        }
    })

    if(!existeId){
        throw new RegistroNaoEncontradoError("Raça/Cor")
    }

    const funcRacaCor = await prisma.servidor.count({
        where:{
            racacor_id: id
        }
    })
    
    if(funcRacaCor > 0){
        throw new RegistroEmUso("Raça / Cor", funcRacaCor)
    }

    return await prismaModel.delete({
        where: {
            id_racacor: id
        }
    })
}

export async function atualizarRacaCor(id: number, data: {descricao: string, ativo?:boolean}) {

    const racaCorExiste = await prismaModel.findUnique({
        where:{
            id_racacor: id
        }
    })

    if(!racaCorExiste){
        throw new RegistroNaoEncontradoError("Raça / Cor")
    }

    const descricaoExiste = await prismaModel.findFirst({
        where: {
            descricao: data.descricao,
            NOT: {
                id_racacor: id
            }
        }
    })

    if(descricaoExiste){
        throw new RegistroJaExistenteError("Sexo")
    }

    return await prisma.sexo.update({
        where: {
            id_sexo: id
        },
        data:{
            descricao: data.descricao,
            ativo: data.ativo ?? racaCorExiste.ativo
        }
    })

}