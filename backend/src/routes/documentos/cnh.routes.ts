import { CnhController } from "../../controllers/documentos/cnh.controller.js";
import { CnhSchemas } from "../../schemas/documentos/cnh.schemas.js";
import { DocumentosRoute } from "./documentos.routes.js";

export class CnhRouter extends DocumentosRoute{
    constructor(){
        super(
            new CnhController(),
            new CnhSchemas(),
        )
    }
}