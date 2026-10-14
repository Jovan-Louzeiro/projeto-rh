import { EscolaridadeService } from "@/services/dominios/escolaridade.service.js";
import { DominioController } from "@/controllers/dominios/dominios.controller.js";

export class EscolaridadeController extends DominioController{
    constructor(){
        super(new EscolaridadeService())
    }
}