import { ComunidadeIndigenaService } from "../../services/dominios/comunidadesIndigenas.service.js";
import { DominioController } from "./dominios.controller.js";

export class ComunidadeIndigenaController extends DominioController{
    constructor(){
        super(new ComunidadeIndigenaService())
    }
}