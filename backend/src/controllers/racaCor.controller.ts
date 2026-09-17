import type { Request, Response } from "express";
import { listarRacaCores, adicionarRacaCor, procurarRacaCor, deletarRacaCor, atualizarRacaCor } from "../services/racaCor.services.js";

export async function adicionar(req:Request, res: Response) {

    const {descricao, ativo} = req.body

    const resposta = await adicionarRacaCor({descricao, ativo})
    
    return res.status(201).json({
        mensagem: "Cadastrado realizado com sucesso",
        prisma: resposta
    })

}

export async function listar(req: Request, res: Response) {

    const RacaCors = await listarRacaCores();

    return res.json(RacaCors);
}



export async function procurar(req: Request, res: Response) {
        
    const id = Number(req.params.id)

    const RacaCor = await procurarRacaCor(id)

    return res.status(200).json(RacaCor)

}

export async function atualizar(req:Request, res:Response) {
    
    const id = Number(req.params.id)

    const {descricao, ativo} = req.body

    const resposta = await atualizarRacaCor(id, {descricao, ativo})

    return res.status(200).json({
        mensagem: "RacaCor atualizado com sucesso",
        prisma: resposta
    })

}


export async function deletar(req:Request, res:Response) {

    const id = Number(req.params.id)

    const resultado = await deletarRacaCor(id)

    return res.status(200).json({
        mensagem: "RacaCor excluido com sucesso",
        prisma: resultado
    })

}