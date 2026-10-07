import type { Request, Response } from "express";
import { CrudSchemas } from "../schemas/crud.schemas.js";
import { CRUDServices } from "../services/crud.service.js";

export class CrudController {

    nome: string

    constructor(
        protected readonly service: CRUDServices<any, any>,
        protected readonly parametroId = "id"
    ) {
        this.nome = service.nome
    }

    adicionar = async (req: Request, res: Response) => {

        const resposta = await this.service.adicionar(req.body);

        return res.status(201).json({
            mensagem: `${this.nome} cadastrado com sucesso`,
            dados: resposta
        });
    }

    listar = async (req: Request, res: Response) => {
        const mostrarTudo = req.query.mostrarTudo === "true";

        const resposta = await this.service.listar(mostrarTudo);

        return res.json(resposta);
    }

    procurar = async (req: Request, res: Response) => {

        const id = Number(req.params[this.parametroId])

        const resposta = await this.service.procurar(id);

        return res.json(resposta);
    }

    atualizar = async(req: Request, res: Response) => {
        
        const id = Number(req.params[this.parametroId])

        const resposta = await this.service.atualizar( id, req.body);

        return res.json({
            mensagem: `${this.nome} atualizado com sucesso`,
            dados: resposta
        });
    }

    deletar = async(req: Request, res: Response) => {
        
        const id = Number(req.params[this.parametroId])

        const resposta = await this.service.deletar(id);

        return res.json({
            mensagem: `${this.nome} Excluído com sucesso`,
            dados: resposta
        });
    }
}