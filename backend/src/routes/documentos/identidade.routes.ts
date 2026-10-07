import { IdentidadeController } from "../../controllers/documentos/identidade.controller.js";
import { IdentidadeSchemas } from "../../schemas/documentos/identidade.schemas.js";
import { DocumentosRoute } from "./documentos.routes.js";

export class IdentidadeRouter extends DocumentosRoute{
    constructor(){
        super(
            new IdentidadeController(),
            new IdentidadeSchemas(),
        )
    }
}