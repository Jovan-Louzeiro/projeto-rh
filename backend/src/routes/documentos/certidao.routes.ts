import { CertidaoController } from "@/controllers/documentos/certidao.controller.js";
import { CertidaoSchemas } from "@/schemas/documentos/certidao.schemas.js";
import { DocumentosRoute } from "@/routes/documentos/documentos.routes.js";

export class CertidaoRouter extends DocumentosRoute<CertidaoController>{
    constructor(){
        super(
            new CertidaoController()
        )
    }
}