import { CtpsController } from "../../controllers/documentos/ctps.controller.js";
import { CtpsSchemas } from "../../schemas/documentos/ctps.schemas.js";
import { DocumentosRoute } from "./documentos.routes.js";

export class CtpsRouter extends DocumentosRoute{
    constructor(){
        super(
            new CtpsController(),
            new CtpsSchemas(),
        )
    }
}