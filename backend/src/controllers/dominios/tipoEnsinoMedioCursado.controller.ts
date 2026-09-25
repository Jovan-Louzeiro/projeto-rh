import { TipoEnsinoMedioCursadoService } from "../../services/dominios/tipoEnsinoMedioCursado.service.js";
import { DominioController } from "./dominios.controller.js";

export class TipoEnsinoMedioCursadoController extends DominioController{
    constructor(){
        super(new TipoEnsinoMedioCursadoService())
    }
}