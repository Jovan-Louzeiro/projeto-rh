import { ComunidadeIndigenaController } from "../../controllers/dominios/comunidadesIndigenas.controller.js";
import { DominioSchemas } from "../../schemas/dominos.schema.js";
import { DominiosRoutes } from "./dominio-base.routes.js";

export class comunidadeIndigenaRoutes extends DominiosRoutes{
    constructor(){
        super(
            new ComunidadeIndigenaController(),
            new DominioSchemas(50)
        )
    }
}