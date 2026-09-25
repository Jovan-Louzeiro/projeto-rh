import { EstadoCivilController } from "../../controllers/dominios/estadoCivil.controller.js";
import { DominioSchemas } from "../../schemas/dominosSchema.js";
import { DominiosRoutes } from "./dominio-base.routes.js";

export class EstadoCivilRouter extends DominiosRoutes{
    constructor(){
        super(
            new EstadoCivilController(),
            new DominioSchemas(15)
    )
    }
}