import { FuncaoService } from "@/services/dominios/funcao.service.js";
import { DominioController } from "@/controllers/dominios/dominios.controller.js";

export class FuncaoController extends DominioController{
    constructor(){
        super(new FuncaoService())
    }
}