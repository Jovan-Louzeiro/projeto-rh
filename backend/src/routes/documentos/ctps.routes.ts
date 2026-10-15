import { CtpsController } from "@/controllers/documentos/ctps.controller.js";
import { CtpsSchemas } from "@/schemas/documentos/ctps.schemas.js";
import { DocumentosRoute } from "@/routes/documentos/documentos.routes.js";

export class CtpsRouter extends DocumentosRoute<CtpsController>{
    constructor(){
        super(
            new CtpsController()
        )
    }
}