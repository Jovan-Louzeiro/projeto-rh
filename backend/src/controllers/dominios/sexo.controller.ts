import { SexoService } from "@/services/dominios/sexo.service.js";
import { DominioController } from "@/controllers/dominios/dominios.controller.js";

export class SexoController extends DominioController{
    constructor(){
        super(new SexoService())
    }
}