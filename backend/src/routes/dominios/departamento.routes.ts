import { DepartamentoController } from "@/controllers/dominios/departamento.controller.js";
import { DepartamentoSchemas } from "@/schemas/dominios/departamento.schema.js";
import { DominiosRoutes } from "@/routes/dominios/dominio-base.routes.js";

export class DepartamentoRouter extends DominiosRoutes{
    constructor(){
        super(
            new DepartamentoController()
    )
    }
}