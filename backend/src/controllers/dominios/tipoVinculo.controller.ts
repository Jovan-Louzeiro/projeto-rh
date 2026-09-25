import { TipoVinculoService } from "../../services/dominios/tipoVinculo.service.js";
import { DominioController } from "./dominios.controller.js";

export class TipoVinculoController extends DominioController{
    constructor(){
        super(new TipoVinculoService())
    }
}