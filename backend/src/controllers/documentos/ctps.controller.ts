import { CtpsService } from "@/services/documentos/ctps.service.js";
import { DocumentosController } from "@/controllers/documentos/documentos.controller.js";
import { CtpsSchemas } from "@/schemas/documentos/ctps.schemas.js";

export class CtpsController extends DocumentosController<
    CtpsService,
    CtpsSchemas
>{

    constructor(){
        super(
            new CtpsService(),
            new CtpsSchemas()
        )
    }

}