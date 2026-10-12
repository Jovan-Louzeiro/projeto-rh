import { EstadoCivilService } from "@/services/dominios/estadoCivil.service.js";
import { DominioController } from "@/controllers/dominios/dominios.controller.js";

export class EstadoCivilController extends DominioController{
    constructor(){
        super(new EstadoCivilService())
    }
}