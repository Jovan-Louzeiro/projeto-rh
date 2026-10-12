import { TipoEnsinoMedioCursadoService } from "@/services/dominios/tipoEnsinoMedioCursado.service.js";
import { DominioController } from "@/controllers/dominios/dominios.controller.js";

export class TipoEnsinoMedioCursadoController extends DominioController{
    constructor(){
        super(new TipoEnsinoMedioCursadoService())
    }
}