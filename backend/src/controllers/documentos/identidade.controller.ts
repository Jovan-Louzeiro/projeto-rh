import { IdentidadeService } from "@/services/documentos/identidade.service.js";
import { DocumentosController } from "@/controllers/documentos/documentos.controller.js";
import { IdentidadeSchemas } from "@/schemas/documentos/identidade.schemas.js";
import { TipoDocumentoDigitalizado } from "#/generated/prisma/enums.js";

export class IdentidadeController extends DocumentosController<
    IdentidadeService,
    IdentidadeSchemas
>{

    constructor(){
        super(
            new IdentidadeService(),
            new IdentidadeSchemas(),
            TipoDocumentoDigitalizado.IDENTIDADE
        )
    }

}