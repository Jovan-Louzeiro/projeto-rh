import { FuncaoController } from "@/controllers/dominios/funcao.controller.js";
import { DominioSchemas } from "@/schemas/dominios/dominos.schema.js";
import { DominiosRoutes } from "@/routes/dominios/dominio-base.routes.js";

export class FuncaoRouter extends DominiosRoutes{
    constructor(){
        super(
            new FuncaoController()
    )
    }
}