import { RacaCorController } from "@/controllers/dominios/racaCor.controller.js";
import { DominioSchemas } from "@/schemas/dominios/dominos.schema.js";
import { DominiosRoutes } from "@/routes/dominios/dominio-base.routes.js";

export class RacaCorRouter extends DominiosRoutes{
    constructor(){
        super(
            new RacaCorController()
    )
    }
}