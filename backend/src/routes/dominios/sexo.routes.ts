import { SexoController } from "@/controllers/dominios/sexo.controller.js";
import { DominioSchemas } from "@/schemas/dominios/dominos.schema.js";
import { DominiosRoutes } from "@/routes/dominios/dominio-base.routes.js";

export class SexoRouter extends DominiosRoutes{
    constructor(){
        super(
            new SexoController()
    )
    }
}