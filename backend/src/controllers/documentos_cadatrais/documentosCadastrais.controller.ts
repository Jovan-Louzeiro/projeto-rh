import { Request, Response } from "express";
import { DocumentosCadastraisServices } from "@/services/registros_servidor/documentos_cadastrais/documentosCadastrais.service.js";
import { CrudController } from "@/controllers/crud.controller.js";

export class DocumentosCadastraisController extends CrudController{
    
    constructor(DocumentoService: DocumentosCadastraisServices<any, any>){
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