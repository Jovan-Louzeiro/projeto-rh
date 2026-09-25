import { NivelController } from "../../controllers/dominios/nivel.controller.js";
import { DominioSchemas } from "../../schemas/dominosSchema.js";
import { DominiosRoutes } from "./dominio-base.routes.js";

export class NivelRouter extends DominiosRoutes{
    constructor(){
        super(
            new NivelController(),
            new DominioSchemas(10)
    )
    }
}