import { FuncaoController } from "../../controllers/dominios/funcao.controller.js";
import { DominioSchemas } from "../../schemas/dominosSchema.js";
import { DominiosRoutes } from "./dominio-base.routes.js";

export class FuncaoRouter extends DominiosRoutes{
    constructor(){
        super(
            new FuncaoController(),
            new DominioSchemas(50)
    )
    }
}