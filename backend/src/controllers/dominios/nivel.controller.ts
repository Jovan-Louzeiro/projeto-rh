import { NivelService } from "@/services/dominios/nivel.service.js";
import { DominioController } from "@/controllers/dominios/dominios.controller.js";

export class NivelController extends DominioController{
    constructor(){
        super(new NivelService())
    }
}