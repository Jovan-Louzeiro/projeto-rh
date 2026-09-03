import type { Request, Response } from "express";
import { listarSexos, adicionarSexo, procurarSexo, deletarSexo, atualizarSexo } from "../services/sexo.services.js";
import { RegistroJaExistenteError, RegistroNaoEncontradoError } from "../errors/dominos.errors.js";
import { adicionarSexoSchema, atualizarSexoSchema } from "../schemas/sexo.schema.js";

export async function adicionar(req:Request, res: Response) {
    
    try{

        const resultado = adicionarSexoSchema.safeParse(req.body)

        console.log(resultado)
        
        if(!resultado.success){
            return res.status(400).json({
                erro: "DADOS_INVALIDOS",
                detalhes: resultado.error.issues
            })
        }
        
        const descricao = resultado.data.descricao
        const resposta = await adicionarSexo(descricao)
        
        return res.status(201).json({
            mensagem: "Sexo cadastrado com sucesso",
            prisma: resposta
        })

    } catch(error){
        console.error(error)

        if(error instanceof RegistroJaExistenteError){
            return res.status(409).json({
                erro: "SEXO_JA_EXISTE",
                mensagem: error.message
            })
        }

        return res.status(500).json({
            erro: "ERRO_INTERNO",
            mensagem: "Erro ao adicionar sexo."
        })
    }
}

export async function listar(req: Request, res: Response) {
    try{
        const sexos = await listarSexos();

        return res.json(sexos);
    } catch (error){
        console.error(error);

        return res.status(500).json({
            erro: "Erro ao buscar sexos"
        })
    }
}



export async function procurar(req: Request, res: Response) {
    try{
        
        const id = Number(req.params.id)

        const sexo = await procurarSexo(id)

        return res.status(200).json(sexo)

    }catch(error){
        console.error(error)

        if(error instanceof RegistroNaoEncontradoError){

            return res.status(404).json({
                error: "REGISTRO_NAO_ENCONTRADO",
                mensagem: error.message
            })
        }

        return res.status(500).json({
            erro: "ERRO_INTERNO",
            mensagem: "Erro ao procurar Sexo"
        })
    }
}

export async function atualizar(req:Request, res:Response) {
    
    try{
        const id = Number(req.params.id)

        const data = atualizarSexoSchema.safeParse(req.body)

        if(!data.success){
            return res.status(400).json({
                error: "DADOS_INVALIDOS",
                detalhes: data.error.issues
            })
        }

        const descricao = data.data.descricao

        const resposta = await atualizarSexo(id, descricao)

        return res.status(200).json({
            mensagem: "Sexo atualizado com sucesso",
            prisma: resposta
        })
    
    }catch(error){
        console.error(error)

        if(error instanceof RegistroNaoEncontradoError){

            return res.status(404).json({
                error: error.name,
                mensagem: error.message
            })
        }

        return res.status(500).json({
            error: "Erro interno do servidor"
        })
    }

}


export async function deletar(req:Request, res:Response) {
    try{

        const id = Number(req.params.id)

        const resultado = await deletarSexo(id)

        return res.status(200).json({
            mensagem: "Sexo excluido com sucesso",
            prisma: resultado
        })

    }catch(error){
        console.error(error)

        if(error instanceof RegistroNaoEncontradoError){

            return res.status(404).json({
                error: error.name,
                mensagem: error.message
        })
    }

        return res.status(500).json({
            error: "Erro interno do servidor"
        })
    }
}