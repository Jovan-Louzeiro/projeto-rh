import { IdentidadeController } from "@/controllers/documentos/identidade.controller.js";
import { IdentidadeSchemas } from "@/schemas/documentos/identidade.schemas.js";
import { DocumentosRoute } from "@/routes/documentos/documentos.routes.js";
import { DocumentosController } from "@/controllers/documentos/documentos.controller.js";

export class IdentidadeRouter extends DocumentosRoute<IdentidadeController>{
    constructor(){
        super(
            new IdentidadeController()
        )
    }
}