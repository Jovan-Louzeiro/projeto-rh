import { TipoVinculoController } from "../../controllers/dominios/tipoVinculo.controller.js";
import { DominioSchemas } from "../../schemas/dominosSchema.js";
import { DominiosRoutes } from "./dominio-base.routes.js";

export class TipoVinculoRouter extends DominiosRoutes{
    constructor(){
        super(
            new TipoVinculoController(),
            new DominioSchemas(50)
    )
    }
}