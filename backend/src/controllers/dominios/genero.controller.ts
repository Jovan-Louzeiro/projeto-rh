import { GeneroServices } from "../../services/dominios/genero.service.js";
import { DominioController } from "./dominios.controller.js";

export class GeneroController extends DominioController{
    constructor(){
        super(new GeneroServices())
    }
}