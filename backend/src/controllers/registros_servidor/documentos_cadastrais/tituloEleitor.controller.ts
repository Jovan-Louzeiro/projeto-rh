import { TituloEleitorService } from "@/services/registros_servidor/documentos_cadastrais/tituloEleitor.service.js";
import { DocumentosCadastraisController } from "@/controllers/registros_servidor/documentos_cadastrais/documentosCadastrais.controller.js";

export class TituloEleitorController extends DocumentosCadastraisController{

    constructor(){
        super(
            new TituloEleitorService()
        )
    }

}