import { TituloEleitorController } from "@/controllers/documentos/tituloEleitor.controller.js";
import { TituloEleitorSchemas } from "@/schemas/documentos/tituloEleitor.schema.js";
import { DocumentosRoute } from "@/routes/documentos/documentos.routes.js";

export class TituloEleitorRouter extends DocumentosRoute<TituloEleitorController>{
    constructor(){
        super(
            new TituloEleitorController()
        )
    }
}