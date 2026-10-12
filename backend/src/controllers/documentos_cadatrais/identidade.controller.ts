import { IdentidadeService } from "@/services/registros_servidor/documentos_cadastrais/identidade.service.js";
import { DocumentosCadastraisController } from "@/controllers/documentos_cadatrais/documentosCadastrais.controller.js";

export class IdentidadeController extends DocumentosCadastraisController{

    constructor(){
        super(
            new IdentidadeService()
        )
    }

}