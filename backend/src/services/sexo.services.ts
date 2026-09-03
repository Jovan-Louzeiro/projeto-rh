import { error } from "node:console";
import { prisma } from "../lib/prisma.js";
import { RegistroEmUso, RegistroJaExistenteError, RegistroNaoEncontradoError } from "../errors/dominos.errors.js";
import { networkInterfaces } from "node:os";
import { id } from "zod/locales";

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
export async function adicionarSexo(descricao: string) {

    const sexoExiste = await prisma.sexo.findUnique({
        where: {
            descricao: descricao
        }
    })
    
    if(sexoExiste){
        throw new RegistroJaExistenteError("Sexo")
    }

    return await prisma.sexo.create({
        data: {
            descricao: descricao
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

export async function atualizarSexo(id: number, descricao: string) {

    const sexoExiste = await prisma.sexo.findUnique({
        where:{
            id_sexo: id
        }
    })

    if(!sexoExiste){
        throw new RegistroNaoEncontradoError("Sexo")
    }

    return await prisma.sexo.update({
        where: {
            id_sexo: id
        },
        data:{
            descricao: descricao
        }
    })

}