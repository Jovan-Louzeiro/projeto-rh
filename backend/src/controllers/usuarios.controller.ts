import type { Request, Response } from "express";
import { listarUsuarios, adicionarUsuario, procurarUsuario, deletarUsuario, atualizarUsuario } from "../services/usuarios.services.js";

export async function adicionar(req:Request, res: Response) {

    const resposta = await adicionarUsuario(req.body)
    
    return res.status(201).json({
        mensagem: "Cadastrado realizado com sucesso",
        prisma: resposta
    })

}

export async function listar(req: Request, res: Response) {

    const usuarios = await listarUsuarios();

    return res.json(usuarios);
}



export async function procurar(req: Request, res: Response) {
        
    const id = Number(req.params.id)

    const usuario = await procurarUsuario(id)

    return res.status(200).json(usuario)

}

export async function atualizar(req:Request, res:Response) {
    
    const id = Number(req.params.id)

    const resposta = await atualizarUsuario(id, req.body)

    return res.status(200).json({
        mensagem: "Usuario atualizado com sucesso",
        prisma: resposta
    })

}


export async function deletar(req:Request, res:Response) {

    const id = Number(req.params.id)

    const resultado = await deletarUsuario(id)

    return res.status(200).json({
        mensagem: "Usuario excluido com sucesso",
        prisma: resultado
    })

}