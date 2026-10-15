import type { Request, Response } from "express";
import { ServidorService } from "@/services/servidor.service.js";
import { CrudController } from "@/controllers/crud.controller.js";
import { ServidorSchemas } from "@/schemas/servidor.schemas.js";
import { obterUsuario } from "@/middlewares/auth.js";

export class ServidorController extends CrudController<ServidorService, ServidorSchemas>{

    constructor(){

        super(
            new ServidorService(),
            new ServidorSchemas(),
            "idServidor"
        )
    }

    procurarContato = async(req: Request, res: Response) => {

        const {idServidor} = this.validarParams(req.params)

        const resposta = await this.service.procurar(idServidor)

        return res.json(resposta);
    }

    atualizar = async(req: Request, res: Response) =>{

        const {idServidor} = this.validarParams(req.params)

        const body = this.validarBody(this.schemas.atualizar, req.body)

        const usuario = obterUsuario(req)

        const resposta = await this.service.atualizar(usuario.nome, idServidor, body)

        return res.json({
            mensagem: `${this.nome} atualizado com sucesso`,
            dados: resposta
        });

    }    

    deletar = async (req: Request, res: Response) =>   {

        const {idServidor} = this.validarParams(req.params)

        const usuario = obterUsuario(req)

        const resposta = await this.service.deletar(idServidor, usuario.nome)

        return res.json({
            mensagem: `${this.nome} Excluído com sucesso`,
            dados: resposta
        });

    }

    contarServidoresAtivos = async(req: Request, res: Response) => {

        const resposta = await this.service.contarServidoresAtivos()

        return res.json({
            servidores_ativos: resposta
        })

    }

    detalhar = async (req: Request, res: Response) => {

        const {idServidor} = this.validarParams(req.params)

        const resposta = await this.service.detalhar(idServidor);

        return res.json(resposta);

    }

}