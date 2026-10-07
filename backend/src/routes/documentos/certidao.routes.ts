import { CertidaoController } from "../../controllers/documentos/certidao.controller.js";
import { CertidaoSchemas } from "../../schemas/documentos/certidao.schemas.js";
import { DocumentosRoute } from "./documentos.routes.js";

export class CertidaoRouter extends DocumentosRoute{
    constructor(){
        super(
            new CertidaoController(),
            new CertidaoSchemas(),
        )
    }
}