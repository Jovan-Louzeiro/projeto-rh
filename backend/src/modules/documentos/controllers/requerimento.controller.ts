import { CrudController } from "@/controllers/crud.controller.js";
import { RequerimentoSchemas } from "@/modules/documentos/schemas/requerimento.schema.js";
import { requerimentoService } from "@/modules/documentos/services/requerimento.service.js";
import { Request, Response } from "express";

export class requerimentoController extends CrudController<requerimentoService, RequerimentoSchemas>{

    constructor(){

        super(
            new requerimentoService(),
            new RequerimentoSchemas()
        )

    }

    listarRequerimentos = async (req: Request, res: Response) => {

        const queryWhere = this.validarQuery(this.schemas.where, req.query)

        return await this.service.listarRequerimentos({
            where: queryWhere
        })

    }

    contarRequerimentos = async (req: Request, res: Response) => {

        const queryWhere = this.validarQuery(this.schemas.where, req.query)

        return await this.service.contarRequerimentos({
            where: queryWhere
        })

    }

    procurarRequerimento = async (req: Request, res: Response) => {

        const {idRequerimento} = this.validarParams(req.params)

        return await this.service.procurarRequerimento({id_requerimento: idRequerimento})

    }

    cadastrarRequerimento = async (req: Request, res: Response) => {

        const body = this.validarBody(this.schemas.adicionar, req.body)

        return await this.service.cadastrarRequerimento({
            dados: body
        })

    }
    

}