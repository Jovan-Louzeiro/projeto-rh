import { ComunidadeIndigenaController } from "@/controllers/dominios/comunidadesIndigenas.controller.js";
import { DominioSchemas } from "@/schemas/dominios/dominos.schema.js";
import { DominiosRoutes } from "@/routes/dominios/dominio-base.routes.js";

export class comunidadeIndigenaRoutes extends DominiosRoutes{
    constructor(){
        super(
            new ComunidadeIndigenaController(),
        )
    }
}