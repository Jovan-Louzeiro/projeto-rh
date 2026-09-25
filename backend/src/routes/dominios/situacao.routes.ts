import { SituacaoController } from "../../controllers/dominios/situacao.controller.js";
import { DominioSchemas } from "../../schemas/dominosSchema.js";
import { DominiosRoutes } from "./dominio-base.routes.js";

export class SituacaoRouter extends DominiosRoutes{
    constructor(){
        super(
            new SituacaoController(),
            new DominioSchemas(30)
    )
    }
}