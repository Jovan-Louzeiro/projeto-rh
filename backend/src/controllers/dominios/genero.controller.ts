import { GeneroServices } from "@/services/dominios/genero.service.js";
import { DominioController } from "@/controllers/dominios/dominios.controller.js";

export class GeneroController extends DominioController{
    constructor(){
        super(new GeneroServices())
    }
}