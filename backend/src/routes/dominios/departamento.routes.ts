import { DepartamentoController } from "../../controllers/dominios/departamento.controller.js";
import { DepartamentoSchemas } from "../../schemas/departamento.schema.js";
import { DominioSchemas } from "../../schemas/dominos.schema.js";
import { DominiosRoutes } from "./dominio-base.routes.js";

export class DepartamentoRouter extends DominiosRoutes{
    constructor(){
        super(
            new DepartamentoController(),
            new DepartamentoSchemas()
    )
    }
}