import { EscolaridadeController } from "@/controllers/dominios/escolaridade.controller.js";
import { DominioSchemas } from "@/schemas/dominios/dominos.schema.js";
import { DominiosRoutes } from "@/routes/dominios/dominio-base.routes.js";

export class EscolaridadeRouter extends DominiosRoutes{
    constructor(){
        super(
            new EscolaridadeController()
    )
    }
}