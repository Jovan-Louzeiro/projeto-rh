import type { Request, Response } from "express";
import { ComunidadeIndigenaServices, escolaridadeServices, generoServices, racaCorServices, sexoServices, type DominioServices } from "../services/dominios.service.js";

export class DominioController {
    constructor(
        private readonly service: DominioServices
    ) {}

    adicionar = async (req: Request, res: Response) => {
        const { descricao, ativo } = req.body;

        const resposta = await this.service.adicionar({
            descricao,
            ativo
        });

        return res.status(201).json({
            mensagem: "Cadastro realizado com sucesso",
            dados: resposta
        });
    }

    listar = async (req: Request, res: Response) => {
        const mostrarTudo = req.query.mostrarTudo === "true";

        const resposta = await this.service.listar(mostrarTudo);

        return res.json(resposta);
    }

    procurar = async (req: Request, res: Response) => {
        const id = Number(req.params.id);

        const resposta = await this.service.procurar(id);

        return res.json(resposta);
    }

    atualizar = async(req: Request, res: Response) => {
        const id = Number(req.params.id);

        const resposta = await this.service.atualizar(
            id,
            req.body
        );

        return res.json({
            mensagem: "Atualizado com sucesso",
            dados: resposta
        });
    }

    deletar = async(req: Request, res: Response) => {
        const id = Number(req.params.id);

        const resposta = await this.service.deletar(id);

        return res.json({
            mensagem: "Excluído com sucesso",
            dados: resposta
        });
    }
}

export const comunidadeIndigenaController = new DominioController(ComunidadeIndigenaServices)

export const escolaridadeController = new DominioController(escolaridadeServices)

export const generoController = new DominioController(generoServices)

export const racaCorController = new DominioController(racaCorServices)

export const sexoController = new DominioController(sexoServices)