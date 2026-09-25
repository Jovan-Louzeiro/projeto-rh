import { SexoController } from "../../controllers/dominios/sexo.controller.js";
import { DominioSchemas } from "../../schemas/dominosSchema.js";
import { DominiosRoutes } from "./dominio-base.routes.js";

export class SexoRouter extends DominiosRoutes{
    constructor(){
        super(
            new SexoController(),
            new DominioSchemas(10)
    )
    }
}