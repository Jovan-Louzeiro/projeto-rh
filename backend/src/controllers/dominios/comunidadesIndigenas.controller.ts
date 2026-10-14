import { ComunidadeIndigenaService } from "@/services/dominios/comunidadesIndigenas.service.js";
import { DominioController } from "@/controllers/dominios/dominios.controller.js";

export class ComunidadeIndigenaController extends DominioController{
    constructor(){
        super(new ComunidadeIndigenaService())
    }
}