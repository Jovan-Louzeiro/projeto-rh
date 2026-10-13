import { Request, Response } from "express";
import { DocumentosCadastraisServices } from "@/services/registros_servidor/documentos_cadastrais/documentosCadastrais.service.js";
import { CrudController } from "@/controllers/crud.controller.js";
import { RegistrosServidorServices } from "@/services/registros_servidor/registrosServidor.service.js";

export class RegistrosServidorController extends CrudController{
    
    constructor(RegistroServidorService: RegistrosServidorServices<any, any>){
        super(
            RegistroServidorService,
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