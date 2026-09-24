import { comunidadeIndigenaService } from "../../services/dominios/comunidadesIndigenas.service.js";
import { DominioController } from "./dominios.controller.js";

class ComunidadeIndigenaController extends DominioController{
    constructor(){
        super(new comunidadeIndigenaService(), "Comunidades Indigenas")
    }
}