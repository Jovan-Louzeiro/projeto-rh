import { TituloEleitorController } from "@/controllers/registros_servidor/documentos_cadastrais/tituloEleitor.controller.js";
import { TituloEleitorSchemas } from "@/schemas/registros_servidor/documentos_cadastrais/tituloEleitor.schema.js";
import { DocumentosCadastraisRoute } from "@/routes/registros_servidor/documentos_cadastrais/documentosCadastrais.routes.js";

export class TituloEleitorRouter extends DocumentosCadastraisRoute{
    constructor(){
        super(
            new TituloEleitorController(),
            new TituloEleitorSchemas(),
        )
    }
}