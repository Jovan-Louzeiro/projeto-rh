import { LocalizacaoDiferenciadaService } from "../../services/dominios/localizacaoDiferenciada.service.js";
import { DominioController } from "./dominios.controller.js";

export class LocalizacaoDiferenciadaController extends DominioController{
    constructor(){
        super(new LocalizacaoDiferenciadaService())
    }
}