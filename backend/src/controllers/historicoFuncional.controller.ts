import { CrudController } from "@/controllers/crud.controller.js";
import { obterUsuario } from "@/middlewares/auth.js";
import { HistoricoFuncionalSchemas } from "@/schemas/historicoFuncional.schema.js";
import { HistoricoFuncionalSevice } from "@/services/historicoFuncional.service.js";
import { Request, Response } from "express";

export class HistoricoFuncionalController extends CrudController<HistoricoFuncionalSevice, HistoricoFuncionalSchemas>{

    constructor(){

        super(
            new HistoricoFuncionalSevice(),
            new HistoricoFuncionalSchemas()
        )

    }

    listarHistoricoFuncionalPorServidor = async (req: Request, res: Response) => {

        const {idServidor, idMatricula} = this.validarParams(req.params)

        const resposta = await this.service.listarHistoricoFuncionalPorMatricula(idServidor, idMatricula)

        return res.json(resposta)

    }

    procurarHistoricoFuncionalServidor = async (req: Request, res: Response) => {
    
        const {idServidor, idMatricula, idHistoricoFuncional} = this.validarParams(req.params)

        const resposta = await this.service.procurarHistoricoFuncionalServidor(idServidor, idMatricula, idHistoricoFuncional)

        return res.json(resposta)

    }

    adicionarHistoricoFuncional = async (req: Request, res: Response) => {

        const usuario = obterUsuario(req)

        const {idServidor, idMatricula} = this.validarParams(req.params)

        req.body.matricula_id = idMatricula

        const data = this.validarBody(this.schemas.adicionar, req.body)

        console.log(data)

        const resposta = await this.service.adicionarHistoricoFuncional(usuario.nome, idServidor, data)

        return res.status(201).json({
            mensagem: `${this.nome} cadastrado com sucesso`,
            dados: resposta
        });

    }

    atualizarHistoricoFuncional = async (req: Request, res: Response) => {

        const usuario = obterUsuario(req)

        const {idServidor, idMatricula, idHistoricoFuncional} = this.validarParams(req.params)

        req.body.matricula_id = idMatricula

        const data = this.validarBody(this.schemas.atualizar, req.body)

        const resposta = await this.service.atualizarHistoricoFuncional(usuario.nome, idServidor, idMatricula, idHistoricoFuncional, data)

        return res.json({
            mensagem: `${this.nome} atualizado com sucesso`,
            dados: resposta
        });

    }

    deletarHistoricoFuncional = async (req: Request, res: Response) => {

        const usuario = obterUsuario(req)

        const {idServidor, idMatricula, idHistoricoFuncional} = this.validarParams(req.params)

        const resposta = await this.service.deletarHistoricoFuncional(usuario.nome, idServidor, idMatricula, idHistoricoFuncional)

        return res.json({
            mensagem: `${this.nome} Excluído com sucesso`,
            dados: resposta
        });

    }

}