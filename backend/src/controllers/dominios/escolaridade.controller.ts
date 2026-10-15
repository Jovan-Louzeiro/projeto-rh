import { EscolaridadeService } from "@/services/dominios/escolaridade.service.js";
import { DominioController } from "@/controllers/dominios/dominios.controller.js";
import { DominioSchemas } from "@/schemas/dominios/dominos.schema.js";

export class EscolaridadeController extends DominioController{
    constructor(){
        super(
            new EscolaridadeService(),
            new DominioSchemas(50)
        )
    }
}