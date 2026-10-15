import { NivelController } from "@/controllers/dominios/nivel.controller.js";
import { DominioSchemas } from "@/schemas/dominios/dominos.schema.js";
import { DominiosRoutes } from "@/routes/dominios/dominio-base.routes.js";

export class NivelRouter extends DominiosRoutes{
    constructor(){
        super(
            new NivelController()
    )
    }
}