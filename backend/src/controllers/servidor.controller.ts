import type { Request, Response } from "express";
import { ServidorService } from "@/services/servidor.service.js";
import { CrudController } from "@/controllers/crud.controller.js";
import { ServidorQuery, ServidorSchemas } from "@/schemas/servidor.schemas.js";
import { obterUsuario } from "@/middlewares/auth.js";
import { object } from "zod";

export class ServidorController extends CrudController<ServidorService, ServidorSchemas> {

    constructor() {

        super(
            new ServidorService(),
            new ServidorSchemas(),
            "idServidor"
        )
    }

    listarServidores = async (req: Request, res: Response) => {

        const {select: camposSelect, ...filtrosQuery} = req.query

        const queryFormatada = {
            ...filtrosQuery,
            ...(typeof camposSelect === "string" && {
                select: camposSelect.split(",")
            })
        }

        const where = this.validarQuery(
            this.schemas.queryParams,
            queryFormatada
        )

        const {select: campos, ...filtros} = where

        const resposta = await this.service.listarServidores({
            filtros: filtros,
            camposSelect: campos
        })

        return res.json(resposta)

    }

    procurarServidor = async (req: Request, res: Response) => {

        const { idServidor } = this.validarParams(req.params)

        const resposta = await this.service.procurar(idServidor)

        return res.json(resposta);
    }

    atualizar = async (req: Request, res: Response) => {

        const { idServidor } = this.validarParams(req.params)

        const body = this.validarBody(this.schemas.atualizar, req.body)

        const usuario = obterUsuario(req)

        const resposta = await this.service.atualizar(usuario.nome, idServidor, body)

        return res.json({
            mensagem: `${this.nome} atualizado com sucesso`,
            dados: resposta
        });

    }

    deletar = async (req: Request, res: Response) => {

        const { idServidor } = this.validarParams(req.params)

        const usuario = obterUsuario(req)

        const resposta = await this.service.deletar(idServidor, usuario.nome)

        return res.json({
            mensagem: `${this.nome} Excluído com sucesso`,
            dados: resposta
        });

    }

    contarServidoresAtivos = async (req: Request, res: Response) => {

        const resposta = await this.service.contarServidoresAtivos()

        return res.json({
            servidores_ativos: resposta
        })

    }

    detalharServidor = async (req: Request, res: Response) => {

        const { idServidor } = this.validarParams(req.params)

        const resposta = await this.service.detalharServidor(idServidor);

        return res.json(resposta);

    }

}