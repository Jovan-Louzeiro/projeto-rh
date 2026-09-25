import { RacaCorController } from "../../controllers/dominios/racaCor.controller.js";
import { DominioSchemas } from "../../schemas/dominosSchema.js";
import { DominiosRoutes } from "./dominio-base.routes.js";

export class RacaCorRouter extends DominiosRoutes{
    constructor(){
        super(
            new RacaCorController(),
            new DominioSchemas(10)
    )
    }
}