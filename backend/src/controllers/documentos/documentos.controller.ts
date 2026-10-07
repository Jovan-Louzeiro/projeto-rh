import { Request, Response } from "express";
import { DocumentosServices } from "../../services/documentos/documentos.service.js";
import { CrudController } from "../crud.controller.js";

export class DocumentosController extends CrudController{
    
    constructor(DocumentoService: DocumentosServices<any, any>){
        super(
            DocumentoService,
            "idServidor"
        )
    
    }

    adicionar = async (req: Request, res: Response) => {
    
            const body = req.body

            body.servidor_id = Number(req.params.idServidor)

            console.log(req.params)

            const resposta = await this.service.adicionar(body);
    
            return res.status(201).json({
                mensagem: `${this.nome} cadastrado com sucesso`,
                dados: resposta
            });
        }

}