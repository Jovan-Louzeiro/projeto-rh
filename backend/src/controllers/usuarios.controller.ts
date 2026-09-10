import type { Request, Response } from "express";
import { listarUsuarios, adicionarUsuario, procurarUsuario, deletarUsuario, atualizarUsuario } from "../services/usuarios.services.js";

export async function adicionar(req:Request, res: Response) {

    const {email, senha, permissao, ativo} = req.body

    const resposta = await adicionarUsuario({email, senha, permissao, ativo})
    
    return res.status(201).json({
        mensagem: "Cadastrado realizado com sucesso",
        prisma: resposta
    })

}

export async function listar(req: Request, res: Response) {

    const sexos = await listarUsuarios();

    return res.json(sexos);
}



export async function procurar(req: Request, res: Response) {
        
    const id = Number(req.params.id)

    const sexo = await procurarUsuario(id)

    return res.status(200).json(sexo)

}

export async function atualizar(req:Request, res:Response) {
    
    const id = Number(req.params.id)

    const {email, senha, permissao, ativo} = req.body

    const resposta = await atualizarUsuario(id, {email, senha, permissao, ativo})

    return res.status(200).json({
        mensagem: "Sexo atualizado com sucesso",
        prisma: resposta
    })

}


export async function deletar(req:Request, res:Response) {

    const id = Number(req.params.id)

    const resultado = await deletarUsuario(id)

    return res.status(200).json({
        mensagem: "Sexo excluido com sucesso",
        prisma: resultado
    })

}