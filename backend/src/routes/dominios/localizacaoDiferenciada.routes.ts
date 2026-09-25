import { LocalizacaoDiferenciadaController } from "../../controllers/dominios/localizacaoDiferenciada.controller.js";
import { DominioSchemas } from "../../schemas/dominosSchema.js";
import { DominiosRoutes } from "./dominio-base.routes.js";

export class LocalizacaoDiferenciadaRouter extends DominiosRoutes{
    constructor(){
        super(
            new LocalizacaoDiferenciadaController(),
            new DominioSchemas(50)
    )
    }
}