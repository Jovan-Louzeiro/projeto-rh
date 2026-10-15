import { LocalizacaoDiferenciadaService } from "@/services/dominios/localizacaoDiferenciada.service.js";
import { DominioController } from "@/controllers/dominios/dominios.controller.js";
import { DominioSchemas } from "@/schemas/dominios/dominos.schema.js";

export class LocalizacaoDiferenciadaController extends DominioController{
    constructor(){
        super(
            new LocalizacaoDiferenciadaService(),
            new DominioSchemas(50)
        )
    }
}