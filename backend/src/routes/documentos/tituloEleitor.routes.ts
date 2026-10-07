import { TituloEleitorController } from "../../controllers/documentos/tituloEleitor.controller.js";
import { TituloEleitorSchemas } from "../../schemas/documentos/tituloEleitor.schema.js";
import { DocumentosRoute } from "./documentos.routes.js";

export class TituloEleitorRouter extends DocumentosRoute{
    constructor(){
        super(
            new TituloEleitorController(),
            new TituloEleitorSchemas(),
        )
    }
}