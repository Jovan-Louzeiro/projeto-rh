import { EstadoCivilController } from "@/controllers/dominios/estadoCivil.controller.js";
import { DominioSchemas } from "@/schemas/dominios/dominos.schema.js";
import { DominiosRoutes } from "@/routes/dominios/dominio-base.routes.js";

export class EstadoCivilRouter extends DominiosRoutes{
    constructor(){
        super(
            new EstadoCivilController(),
            new DominioSchemas(15)
    )
    }
}