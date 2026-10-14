import { TituloEleitorService } from "@/services/registros_servidor/documentos_cadastrais/tituloEleitor.service.js";
import { DocumentosCadastraisController } from "@/controllers/registros_servidor/documentos_cadastrais/documentosCadastrais.controller.js";
import type { TituloEleitorCreate, TituloEleitorUpdate } from "@/schemas/registros_servidor/documentos_cadastrais/tituloEleitor.schema.js";

export class TituloEleitorController extends DocumentosCadastraisController<
    TituloEleitorService<TituloEleitorCreate, TituloEleitorUpdate>
>{

    constructor(){
        super(
            new TituloEleitorService<TituloEleitorCreate, TituloEleitorUpdate>()
        )
    }

}