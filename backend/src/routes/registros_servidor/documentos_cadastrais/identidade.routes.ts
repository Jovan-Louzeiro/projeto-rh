import { IdentidadeController } from "@/controllers/registros_servidor/documentos_cadastrais/identidade.controller.js";
import { IdentidadeSchemas } from "@/schemas/registros_servidor/documentos_cadastrais/identidade.schemas.js";
import { DocumentosCadastraisRoute } from "@/routes/registros_servidor/documentos_cadastrais/documentosCadastrais.routes.js";

export class IdentidadeRouter extends DocumentosCadastraisRoute{
    constructor(){
        super(
            new IdentidadeController(),
            new IdentidadeSchemas(),
        )
    }
}