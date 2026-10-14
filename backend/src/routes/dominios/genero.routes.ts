import { GeneroController } from "@/controllers/dominios/genero.controller.js";
import { DominioSchemas } from "@/schemas/dominios/dominos.schema.js";
import { DominiosRoutes } from "@/routes/dominios/dominio-base.routes.js";

export class GeneroRouter extends DominiosRoutes{
    constructor(){
        super(
            new GeneroController(),
            new DominioSchemas(20)
    )
    }
}