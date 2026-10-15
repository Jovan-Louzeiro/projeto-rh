import { ContatoService } from "@/services/contato.service.js";
import type { Request, Response } from "express";
import { CrudController } from "@/controllers/crud.controller.js";
import { ContatoSchema } from "@/schemas/contato.schemas.js";
import { obterUsuario } from "@/middlewares/auth.js";

export class ContatoController extends CrudController<ContatoService<any, any>, ContatoSchema> {

    constructor(){

        super(
            new ContatoService(),
            new ContatoSchema(),
            "id"
        );
    }

    listarPorServidor = async (req: Request, res: Response) => {

        const params = this.validarParams(req.params)

        const {id_servidor} = params

        const resposta = await this.service.listarPorServidor(id_servidor);

        return res.json(resposta);
    };

    procurarContato = async (req: Request, res: Response) => {

        const {id, idServidor} = this.validarParams(req.params)

        const resposta = await this.service.procurarContato(idServidor, id)

        return res.json(resposta)
    }

    adicionar = async (req: Request, res: Response) => {

        const {idServidor} = this.validarParams(req.params)

        req.body.servidor_id = idServidor

        const body = this.validarBody(this.schemas.adicionar, req.body)

        const usuario = obterUsuario(req)

        const resposta = await this.service.adicionar(usuario.name, body)

        return res.status(201).json({
            mensagem: `${this.nome} cadastrado com sucesso`,
            dados: resposta
        });

    }

    atualizar = async(req: Request, res: Response) => {

        const {idServidor, id} = this.validarParams(req.params)

        req.body.servidor_id = idServidor

        const body = this.validarBody(this.schemas.atualizar, req.body)

        const usuario = obterUsuario(req)

        const resposta = await this.service.atualizar(usuario.nome, id, body)

        return res.json({
            mensagem: `${this.nome} atualizado com sucesso`,
            dados: resposta
        });

    }


    deletar = async(req: Request, res: Response) => {

        const {idServidor, id} = this.validarParams(req.params)

        const usuario = obterUsuario(req)

        const resposta = await this.service.deletarContato(idServidor, id, usuario.nome)

        return res.json({
            mensagem: `${this.nome} Excluído com sucesso`,
            dados: resposta
        });
    }
}