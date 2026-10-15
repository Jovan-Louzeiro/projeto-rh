import { TipoEnsinoMedioCursadoService } from "@/services/dominios/tipoEnsinoMedioCursado.service.js";
import { DominioController } from "@/controllers/dominios/dominios.controller.js";
import { DominioSchemas } from "@/schemas/dominios/dominos.schema.js";

export class TipoEnsinoMedioCursadoController extends DominioController{
    constructor(){
        super(
            new TipoEnsinoMedioCursadoService(),
            new DominioSchemas(50)
        )
    }
}