import { SituacaoController } from "@/controllers/dominios/situacao.controller.js";
import { DominioSchemas } from "@/schemas/dominios/dominos.schema.js";
import { DominiosRoutes } from "@/routes/dominios/dominio-base.routes.js";

export class SituacaoRouter extends DominiosRoutes{
    constructor(){
        super(
            new SituacaoController()
    )
    }
}