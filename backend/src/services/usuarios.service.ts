import { error } from "node:console"
import { prisma } from "../lib/prisma.js"
import { RegistroEmUso, RegistroJaExistenteError, RegistroNaoEncontradoError } from "../errors/dominios.errors.js"
import { email, string } from "zod"
import { gerarHash } from "../utils/senha.js"
import { PermissaoUsuario } from "../../generated/prisma/enums.js"



const prismaModel = prisma.usuario

export async function listarUsuarios(mostrarTudo?: boolean) {

    if (mostrarTudo) {
        return await prismaModel.findMany({
            omit: {
                senha: true
            }
        })
    }

    return await prismaModel.findMany({
        where: {
            ativo: true
        },
        omit: {
            senha: true
        }
    })
}

export async function adicionarUsuario(objeto: { nome: string, email: string, senha: string, permissao: PermissaoUsuario, ativo: boolean }) {

    return await prismaModel.create({
        data: {
            nome: objeto.nome,
            email: objeto.email,
            senha: await gerarHash(objeto.senha),
            permissao: objeto.permissao,
            ativo: objeto.ativo ?? true
        }
    })

}

export async function procurarUsuario(id: number) {
    const resultado = await prismaModel.findUnique({
        where: {
            id_usuario: id
        }
    })

    if (!resultado) {
        throw new RegistroNaoEncontradoError("Usuario")
    }

    return resultado
}

export async function deletarUsuario(id: number) {

    await procurarUsuario(id)

    // Adicionar Ifs de verificação de uso

    return await prismaModel.delete({
        where: {
            id_usuario: id
        }
    })
}

export async function atualizarUsuario(id: number, data: { nome: string, email: string, senha: string, permissao: PermissaoUsuario, ativo: boolean }) {

    const usuarioExiste = await procurarUsuario(id)

    return await prismaModel.update({
        where: {
            id_usuario: id
        },
        data: {
            nome: data.nome ?? usuarioExiste.nome,
            email: data.email ?? usuarioExiste.email,
            senha: data.senha ? await gerarHash(data.senha) : usuarioExiste.senha,
            permissao: data.permissao ?? usuarioExiste.permissao,
            ativo: data.ativo ?? usuarioExiste.ativo
        }
    })
}