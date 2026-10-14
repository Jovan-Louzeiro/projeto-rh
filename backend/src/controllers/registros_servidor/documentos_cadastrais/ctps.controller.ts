import { CtpsService } from "@/services/registros_servidor/documentos_cadastrais/ctps.service.js";
import { DocumentosCadastraisController } from "@/controllers/registros_servidor/documentos_cadastrais/documentosCadastrais.controller.js";

export class CtpsController extends DocumentosCadastraisController<
    CtpsService
>{

    constructor(){
        super(
            new CtpsService()
        )
    }

}