import { TituloEleitorService } from "@/services/documentos/tituloEleitor.service.js";
import { DocumentosController } from "@/controllers/documentos/documentos.controller.js";
import { TituloEleitorCreate, TituloEleitorSchemas, TituloEleitorUpdate } from "@/schemas/documentos/tituloEleitor.schema.js";

export class TituloEleitorController extends DocumentosController<
    TituloEleitorService,
    TituloEleitorSchemas
>{

    constructor(){
        super(
            new TituloEleitorService(),
            new TituloEleitorSchemas()
        )
    }

}