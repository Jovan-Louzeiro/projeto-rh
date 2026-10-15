import { TipoVinculoController } from "@/controllers/dominios/tipoVinculo.controller.js";
import { DominioSchemas } from "@/schemas/dominios/dominos.schema.js";
import { DominiosRoutes } from "@/routes/dominios/dominio-base.routes.js";

export class TipoVinculoRouter extends DominiosRoutes{
    constructor(){
        super(
            new TipoVinculoController()
    )
    }
}