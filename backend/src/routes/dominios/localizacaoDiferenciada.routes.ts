import { LocalizacaoDiferenciadaController } from "@/controllers/dominios/localizacaoDiferenciada.controller.js";
import { DominioSchemas } from "@/schemas/dominios/dominos.schema.js";
import { DominiosRoutes } from "@/routes/dominios/dominio-base.routes.js";
import { autorizacoesCadastroRh } from "@/types/crud.types.js";

export class LocalizacaoDiferenciadaRouter extends DominiosRoutes{
    constructor(){
        super(
            new LocalizacaoDiferenciadaController(),
            autorizacoesCadastroRh
    )
    }
}