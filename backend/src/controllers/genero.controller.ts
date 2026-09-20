import type { Request, Response } from "express";
import { listarGeneros, adicionarGenero, procurarGenero, deletarGenero, atualizarGenero } from "../services/genero.service.js";

export async function adicionar(req:Request, res: Response) {

    const {descricao, ativo} = req.body

    const resposta = await adicionarGenero({descricao, ativo})
    
    return res.status(201).json({
        mensagem: "Cadastrado realizado com sucesso",
        prisma: resposta
    })

}

export async function listar(req: Request, res: Response) {

    const Generos = await listarGeneros();

    return res.json(Generos);
}



export async function procurar(req: Request, res: Response) {
        
    const id = Number(req.params.id)

    const Genero = await procurarGenero(id)

    return res.status(200).json(Genero)

}

export async function atualizar(req:Request, res:Response) {
    
    const id = Number(req.params.id)

    const resposta = await atualizarGenero(id, req.body)

    return res.status(200).json({
        mensagem: "Genero atualizado com sucesso",
        prisma: resposta
    })

}


export async function deletar(req:Request, res:Response) {

    const id = Number(req.params.id)

    const resultado = await deletarGenero(id)

    return res.status(200).json({
        mensagem: "Genero excluido com sucesso",
        prisma: resultado
    })

}