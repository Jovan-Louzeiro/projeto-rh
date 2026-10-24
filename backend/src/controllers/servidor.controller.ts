import type { Request, Response } from "express";
import { ServidorService } from "@/services/servidor.service.js";
import { CrudController } from "@/controllers/crud.controller.js";
import { ServidorQuery, ServidorSchemas } from "@/schemas/servidor.schemas.js";
import { obterUsuario } from "@/middlewares/auth.js";
import { object } from "zod";
import { MatriculaSchemas } from "@/schemas/matricula.schemas.js";
import { HistoricoFuncionalSchemas } from "@/schemas/historicoFuncional.schema.js";
import { Prisma } from "#/generated/prisma/client.js";

export class ServidorController extends CrudController<ServidorService, ServidorSchemas> {

    constructor() {

        super(
            new ServidorService(),
            new ServidorSchemas(),
            "idServidor"
        )



    }

    private matriculaSchema = new MatriculaSchemas()
    private historicosFuncionaisShemas = new HistoricoFuncionalSchemas()

    listarServidores = async (req: Request, res: Response) => {

        const { servidorSelect, matriculasSelect, historicosFuncionaisSelect, ...filtrosQuery } = req.query

        const camposSelect = {

            servidorSelect: typeof servidorSelect === "string"
                ? this.validarQuery(this.schemas.queryParams, { select: servidorSelect.split(",") }).select
                : undefined,

            matriculasSelect: typeof matriculasSelect === "string"
                ? this.validarQuery(this.matriculaSchema.queryParams, { select: matriculasSelect.split(",") }).select
                : undefined,

            historicosFuncionaisSelect: typeof historicosFuncionaisSelect === "string"
                ? this.validarQuery(this.historicosFuncionaisShemas.queryParams, { select: historicosFuncionaisSelect.split(",") }).select
                : undefined

        }

        const filtrosValidados = {

            servidorFiltro: this.validarQuery(this.schemas.queryParams, filtrosQuery),

            matriculasFiltro: this.validarQuery(this.matriculaSchema.queryParams, filtrosQuery),

            historicosFuncionaisFiltro: this.validarQuery(this.historicosFuncionaisShemas.queryParams, filtrosQuery)

        }

        const filtros = Object.fromEntries(
            Object.entries(filtrosValidados).filter(
                ([, valor]) =>
                    valor !== null &&
                    Object.keys(valor).length > 0
            )
        )

        const resposta = await this.service.listarServidores(
            {
                filtros: filtros,

                camposSelect: camposSelect
            }
        )


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

    contarServidores = async (req: Request, res: Response) => {

        const filtrosQuery = req.query


        const filtrosValidados = {

            servidorFiltro: this.validarQuery(this.schemas.queryParams, filtrosQuery),

            matriculasFiltro: this.validarQuery(this.matriculaSchema.queryParams, filtrosQuery),

            historicosFuncionaisFiltro: this.validarQuery(this.historicosFuncionaisShemas.queryParams, filtrosQuery)

        }

        const filtros = Object.fromEntries(
            Object.entries(filtrosValidados).filter(
                ([, valor]) =>
                    valor !== null &&
                    Object.keys(valor).length > 0
            )
        )

        const resposta = await this.service.contarServidores({filtros: filtros})

        return res.json({"total": resposta})

    }

    detalharServidor = async (req: Request, res: Response) => {

        const { idServidor } = this.validarParams(req.params)

        const resposta = await this.service.detalharServidor(idServidor);

        return res.json(resposta);

    }

}