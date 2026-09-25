import { GeneroController } from "../../controllers/dominios/genero.controller.js";
import { DominioSchemas } from "../../schemas/dominosSchema.js";
import { DominiosRoutes } from "./dominio-base.routes.js";

export class GeneroRouter extends DominiosRoutes{
    constructor(){
        super(
            new GeneroController(),
            new DominioSchemas(20)
    )
    }
}