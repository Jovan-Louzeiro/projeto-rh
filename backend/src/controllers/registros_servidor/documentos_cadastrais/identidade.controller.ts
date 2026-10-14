import { IdentidadeService } from "@/services/registros_servidor/documentos_cadastrais/identidade.service.js";
import { DocumentosCadastraisController } from "@/controllers/registros_servidor/documentos_cadastrais/documentosCadastrais.controller.js";

export class IdentidadeController extends DocumentosCadastraisController<
    IdentidadeService
>{

    constructor(){
        super(
            new IdentidadeService()
        )
    }

}