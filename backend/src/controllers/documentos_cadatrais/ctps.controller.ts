import { CtpsService } from "@/services/registros_servidor/documentos_cadastrais/ctps.service.js";
import { DocumentosCadastraisController } from "@/controllers/documentos_cadatrais/documentosCadastrais.controller.js";

export class CtpsController extends DocumentosCadastraisController{

    constructor(){
        super(
            new CtpsService()
        )
    }

}