import { CertidaoService } from "@/services/documentos/certidao.service.js";
import { DocumentosController } from "@/controllers/documentos/documentos.controller.js";
import { CertidaoSchemas } from "@/schemas/documentos/certidao.schemas.js";

export class CertidaoController extends DocumentosController<
    CertidaoService,
    CertidaoSchemas
>{

    constructor(){
        super(
            new CertidaoService(),
            new CertidaoSchemas()
        )
    }

}