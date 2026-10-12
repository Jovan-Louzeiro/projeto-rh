import { CnhController } from "@/controllers/documentos_cadatrais/cnh.controller.js";
import { CnhSchemas } from "@/schemas/registros_servidor/documentos_cadastrais/cnh.schemas.js";
import { DocumentosCadastraisRoute } from "@/routes/registros_servidor/documentos_cadastrais/documentosCadastrais.routes.js";

export class CnhRouter extends DocumentosCadastraisRoute{
    constructor(){
        super(
            new CnhController(),
            new CnhSchemas(),
        )
    }
}