import { NivelService } from "../../services/dominios/nivel.service.js";
import { DominioController } from "./dominios.controller.js";

export class NivelController extends DominioController{
    constructor(){
        super(new NivelService())
    }
}