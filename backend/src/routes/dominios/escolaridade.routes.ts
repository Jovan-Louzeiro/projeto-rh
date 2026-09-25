import { EscolaridadeController } from "../../controllers/dominios/escolaridade.controller.js";
import { DominioSchemas } from "../../schemas/dominosSchema.js";
import { DominiosRoutes } from "./dominio-base.routes.js";

export class EscolaridadeRouter extends DominiosRoutes{
    constructor(){
        super(
            new EscolaridadeController(),
            new DominioSchemas(50)
    )
    }
}