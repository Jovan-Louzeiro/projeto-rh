import { TipoEnsinoMedioCursadoController } from "../../controllers/dominios/tipoEnsinoMedioCursado.controller.js";
import { DominioSchemas } from "../../schemas/dominosSchema.js";
import { DominiosRoutes } from "./dominio-base.routes.js";

export class TipoEnsinoMedioCursadoRouter extends DominiosRoutes{
    constructor(){
        super(
            new TipoEnsinoMedioCursadoController(),
            new DominioSchemas(50)
    )
    }
}