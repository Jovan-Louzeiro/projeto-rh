import { FuncaoService } from "@/services/dominios/funcao.service.js";
import { DominioController } from "@/controllers/dominios/dominios.controller.js";
import { DominioSchemas } from "@/schemas/dominios/dominos.schema.js";

export class FuncaoController extends DominioController{
    constructor(){
        super(
            new FuncaoService(),
            new DominioSchemas(50)
        )
    }
}