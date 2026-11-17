import { CnhService } from "@/services/documentos/cnh.service.js";
import { DocumentosController } from "@/controllers/documentos/documentos.controller.js";
import { CnhCreate, CnhSchemas, CnhUpdate } from "@/schemas/documentos/cnh.schemas.js";
import { TipoDocumentoDigitalizado } from "#/generated/prisma/enums.js";

export class CnhController extends DocumentosController<
    CnhService,
    CnhSchemas
>{

    constructor(){
        super(
            new CnhService(),
            new CnhSchemas(),
            TipoDocumentoDigitalizado.CNH
        )
    }

}