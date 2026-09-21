import type { Request, Response } from "express";
import { listarComunidadesIndigenas, adicionarComunidadeIndigena, procurarComunidadeIndigena, deletarComunidadeIndigena, atualizarComunidadeIndigena } from "../services/comunidadeIndigena.service.js";

export async function adicionar(req:Request, res: Response) {

    const {descricao, ativo} = req.body

    const resposta = await adicionarComunidadeIndigena({descricao, ativo})
    
    return res.status(201).json({
        mensagem: "Cadastrado realizado com sucesso",
        prisma: resposta
    })

}

export async function listar(req: Request, res: Response) {

    const ComunidadesIndigenas = await listarComunidadesIndigenas();

    return res.json(ComunidadesIndigenas);
}



export async function procurar(req: Request, res: Response) {
        
    const id = Number(req.params.id)

    const ComunidadeIndigena = await procurarComunidadeIndigena(id)

    return res.status(200).json(ComunidadeIndigena)

}

export async function atualizar(req:Request, res:Response) {
    
    const id = Number(req.params.id)

    const resposta = await atualizarComunidadeIndigena(id, req.body)

    return res.status(200).json({
        mensagem: "Comunidade Indigena atualizado com sucesso",
        prisma: resposta
    })

}


export async function deletar(req:Request, res:Response) {

    const id = Number(req.params.id)

    const resultado = await deletarComunidadeIndigena(id)

    return res.status(200).json({
        mensagem: "Comunidade Indigena excluido com sucesso",
        prisma: resultado
    })

}