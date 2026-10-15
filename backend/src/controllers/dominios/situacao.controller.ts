import { SituacaoService } from "@/services/dominios/situacao.service.js";
import { DominioController } from "@/controllers/dominios/dominios.controller.js";
import { DominioSchemas } from "@/schemas/dominios/dominos.schema.js";

export class SituacaoController extends DominioController{
    constructor(){
        super(
            new SituacaoService(),
            new DominioSchemas(30)
        )
    }
}