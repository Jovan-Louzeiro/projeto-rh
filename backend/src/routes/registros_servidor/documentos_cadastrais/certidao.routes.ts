import { CertidaoController } from "@/controllers/documentos_cadatrais/certidao.controller.js";
import { CertidaoSchemas } from "@/schemas/registros_servidor/documentos_cadastrais/certidao.schemas.js";
import { DocumentosCadastraisRoute } from "@/routes/registros_servidor/documentos_cadastrais/documentosCadastrais.routes.js";

export class CertidaoRouter extends DocumentosCadastraisRoute{
    constructor(){
        super(
            new CertidaoController(),
            new CertidaoSchemas(),
        )
    }
}