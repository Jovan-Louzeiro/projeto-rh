import type { Request, Response } from "express";
import { listarSexos, adicionarSexo, procurarSexo, deletarSexo, atualizarSexo } from "../services/sexo.services.js";

export async function adicionar(req:Request, res: Response) {

    const {descricao, ativo} = req.body

    const resposta = await adicionarSexo({descricao, ativo})
    
    return res.status(201).json({
        mensagem: "Cadastrado realizado com sucesso",
        prisma: resposta
    })

}

export async function listar(req: Request, res: Response) {

    const sexos = await listarSexos();

    return res.json(sexos);
}



export async function procurar(req: Request, res: Response) {
        
    const id = Number(req.params.id)

    const sexo = await procurarSexo(id)

    return res.status(200).json(sexo)

}

export async function atualizar(req:Request, res:Response) {
    
    const id = Number(req.params.id)

    const {descricao, ativo} = req.body

    const resposta = await atualizarSexo(id, {descricao, ativo})

    return res.status(200).json({
        mensagem: "Sexo atualizado com sucesso",
        prisma: resposta
    })

}


export async function deletar(req:Request, res:Response) {

    const id = Number(req.params.id)

    const resultado = await deletarSexo(id)

    return res.status(200).json({
        mensagem: "Sexo excluido com sucesso",
        prisma: resultado
    })

}