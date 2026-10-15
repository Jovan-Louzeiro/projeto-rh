import { CnhController } from "@/controllers/documentos/cnh.controller.js";
import { CnhSchemas } from "@/schemas/documentos/cnh.schemas.js";
import { DocumentosRoute } from "@/routes/documentos/documentos.routes.js";

export class CnhRouter extends DocumentosRoute<CnhController>{
    constructor(){
        super(
            new CnhController()
        )
    }
}