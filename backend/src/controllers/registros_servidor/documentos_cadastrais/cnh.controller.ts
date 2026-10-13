import { CnhService } from "@/services/registros_servidor/documentos_cadastrais/cnh.service.js";
import { DocumentosCadastraisController } from "@/controllers/registros_servidor/documentos_cadastrais/documentosCadastrais.controller.js";

export class CnhController extends DocumentosCadastraisController{

    constructor(){
        super(
            new CnhService()
        )
    }

}