import type { Request, Response } from "express";
import { CRUDServices } from "@/services/crud.service.js";
import { obterUsuario } from "@/middlewares/auth.js";

export type ParametrosController = {
    procurar?: string;
    atualizar?: string;
    deletar?: string;
} | string;

export class CrudController<
    TService extends CRUDServices<any, any> = CRUDServices<any, any>
>{
    
    nome: string
    protected readonly parametroId: Required<Exclude<ParametrosController, string>>;

    constructor(
        protected readonly service: TService,
        parametros: ParametrosController = {}
    ) {
        this.parametroId = {
            procurar: "id",
            atualizar: "id",
            deletar: "id",
            ...(typeof parametros === "string"
                ? {
                    procurar: parametros,
                    atualizar: parametros,
                    deletar: parametros,
                }
                : parametros),
        }

        this.nome = service.nome
    }

    adicionar = async (req: Request, res: Response) => {

        const usuario = obterUsuario(req)

        const resposta = await this.service.adicionar(usuario.nome, req.body);

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

        const id = Number(req.params[this.parametroId.procurar])

        const resposta = await this.service.procurar(id);

        return res.json(resposta);
    }

    atualizar = async(req: Request, res: Response) => {
        
        const id = Number(req.params[this.parametroId.atualizar])

        const usuario = obterUsuario(req)

        const resposta = await this.service.atualizar( usuario.nome, id, req.body);

        return res.json({
            mensagem: `${this.nome} atualizado com sucesso`,
            dados: resposta
        });
    }

    deletar = async(req: Request, res: Response) => {
        
        const id = Number(req.params[this.parametroId.deletar])

        const usuario = obterUsuario(req)

        const resposta = await this.service.deletar(id, usuario.nome);

        return res.json({
            mensagem: `${this.nome} Excluído com sucesso`,
            dados: resposta
        });
    }
}