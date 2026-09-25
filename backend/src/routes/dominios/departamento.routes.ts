import { DepartamentoController } from "../../controllers/dominios/departamento.controller.js";
import { DominioSchemas } from "../../schemas/dominosSchema.js";
import { DominiosRoutes } from "./dominio-base.routes.js";

export class DepartamentoRouter extends DominiosRoutes{
    constructor(){
        super(
            new DepartamentoController(),
            new DominioSchemas(50)
    )
    }
}