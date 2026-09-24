import { RegistroEmUso, RegistroJaExistenteError, RegistroNaoEncontradoError } from "../errors/dominios.errors.js";
import { prisma } from "../lib/prisma.js";

const prismaModel = prisma.pais
const nome = "País"

export async function listarPaises(mostrarTudo?: boolean) {
    if (mostrarTudo) {
        return await prismaModel.findMany()
    }

    return await prismaModel.findMany({
        where: {
            ativo: true
        }
    })
}

export async function procurarPais(id: number) {

    const pais = await prismaModel.findUnique({
        where: {
            id_pais: id
        }
    })

    if (!pais) {
        throw new RegistroNaoEncontradoError(nome)
    }

    return pais
}

export async function adicionarPais(data: { nome: string, gentilico: string, codigo_iso: string, ativo?: boolean }) {

    return await prismaModel.create({
        data: {
            nome: data.nome,
            gentilico: data.gentilico,
            codigo_iso: data.codigo_iso,
            ativo: data.ativo ?? true
        }
    })

}

export async function atualizarPais(id: number, data: { nome?: string, gentilico?: string, codigo_iso?: string, ativo?: boolean }) {
  const paisExiste = await procurarPais(id)

  return await prismaModel.update({
    where: {
      id_pais: id
    },
    data: {
      nome: data.nome ?? paisExiste.nome,
      gentilico: data.gentilico ?? paisExiste.gentilico,
      codigo_iso: data.codigo_iso ?? paisExiste.codigo_iso,
      ativo: data.ativo ?? paisExiste.ativo
    }
  })
}

export async function deletarPais(id:number) {
    
    await procurarPais(id)

    return prismaModel.delete({
        where: {
            id_pais: id
        }
    })
}