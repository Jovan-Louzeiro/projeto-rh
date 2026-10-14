import { CtpsController } from "@/controllers/registros_servidor/documentos_cadastrais/ctps.controller.js";
import { CtpsSchemas } from "@/schemas/registros_servidor/documentos_cadastrais/ctps.schemas.js";
import { DocumentosCadastraisRoute } from "@/routes/registros_servidor/documentos_cadastrais/documentosCadastrais.routes.js";

export class CtpsRouter extends DocumentosCadastraisRoute{
    constructor(){
        super(
            new CtpsController(),
            new CtpsSchemas(),
        )
    }
}