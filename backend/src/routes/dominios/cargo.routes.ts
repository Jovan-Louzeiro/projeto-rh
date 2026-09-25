import { CargoController } from "../../controllers/dominios/cargo.controller.js";
import { DominioSchemas } from "../../schemas/dominosSchema.js";
import { DominiosRoutes } from "./dominio-base.routes.js";

export class CargoRouter extends DominiosRoutes{
    constructor(){
        super(
            new CargoController(),
            new DominioSchemas(50)
    )
    }
}