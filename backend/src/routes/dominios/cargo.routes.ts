import { CargoController } from "@/controllers/dominios/cargo.controller.js";
import { DominioSchemas } from "@/schemas/dominios/dominos.schema.js";
import { DominiosRoutes } from "@/routes/dominios/dominio-base.routes.js";
import { autorizacoesCadastroRh } from "@/types/crud.types.js";

export class CargoRouter extends DominiosRoutes{
    constructor(){
        super(
            new CargoController(),
            autorizacoesCadastroRh
    )
    }
}