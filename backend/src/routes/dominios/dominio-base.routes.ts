import { DominioController } from "../../controllers/dominios/dominios.controller.js";
import { DominioSchemas } from "../../schemas/dominosSchema.js";
import { Autorizacoes } from "../../types/crud.types.js";
import { CurdRoutes } from "../curd.routes.js";

export class DominiosRoutes extends CurdRoutes{

    constructor(
        DominioController: DominioController,
        DominioSchema: DominioSchemas,
        autorizacoes: Autorizacoes
    ){
        super(
            DominioController,
            DominioSchema,
            autorizacoes
        )
    }

}