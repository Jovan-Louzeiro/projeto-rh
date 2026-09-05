import { prisma } from "../lib/prisma.js";
import { RegistroEmUso, RegistroJaExistenteError, RegistroNaoEncontradoError } from "../errors/dominios.errors.js";

//  Pesquisar todos Sexos
export async function listarSexos() {
    return await prisma.sexo.findMany()
}

// Procurar um sexo

export async function procurarSexo(id: number){
    
    const resultado = await prisma.sexo.findUnique({
        where: {
            id_sexo: id
        }
    })

    if(!resultado){
        throw new RegistroNaoEncontradoError("Sexo")
    }

    return resultado
}

// Adicionar um Sexo
export async function adicionarSexo(data:{ descricao: string, ativo?: boolean}) {

    const sexoExiste = await prisma.sexo.findUnique({
        where: {
            descricao: data.descricao
        }
    })
    
    if(sexoExiste){
        throw new RegistroJaExistenteError("Sexo")
    }

    return await prisma.sexo.create({
        data: {
            descricao: data.descricao,
            ativo: data.ativo ?? true
        }
    })

}

export async function deletarSexo(id:number) {

    const existeId = await prisma.sexo.findUnique({
        where: {
            id_sexo: id
        }
    })

    if(!existeId){
        throw new RegistroNaoEncontradoError("Sexo")
    }

    const funcSexo = await prisma.servidor.count({
        where:{
            sexo_id: id
        }
    })
    
    if(funcSexo > 0){
        throw new RegistroEmUso("Sexo", funcSexo)
    }

    return await prisma.sexo.delete({
        where: {
            id_sexo: id
        }
    })
}

export async function atualizarSexo(id: number, data: {descricao: string, ativo?:boolean}) {

    const sexoExiste = await prisma.sexo.findUnique({
        where:{
            id_sexo: id
        }
    })

    if(!sexoExiste){
        throw new RegistroNaoEncontradoError("Sexo")
    }

    const descricaoExiste = await prisma.sexo.findFirst({
        where: {
            descricao: data.descricao,
            NOT: {
                id_sexo: id
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
            ativo: data.ativo ?? sexoExiste.ativo
        }
    })

}