import { RacaCorService } from "../../services/dominios/racaCor.service.js";
import { DominioController } from "./dominios.controller.js";

export class RacaCorController extends DominioController{
    constructor(){
        super(new RacaCorService())
    }
}