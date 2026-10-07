import { Request, Response } from "express";
import { ServidorService } from "../services/servidor.service.js";
import { CrudController } from "./crud.controller.js";

export class ServidorController extends CrudController{

    constructor(private readonly servidorService = new ServidorService()){

        super(
            servidorService,
            "idServidor"
        )
    }

    detalharDocumentos = async (req: Request, res: Response) => {

        const id = Number(req.params[this.parametroId])

        const resposta = await this.servidorService.detalhar(id);

        return res.json(resposta);

    }

}