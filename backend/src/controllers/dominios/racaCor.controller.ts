import { RacaCorService } from "@/services/dominios/racaCor.service.js";
import { DominioController } from "@/controllers/dominios/dominios.controller.js";
import { DominioSchemas } from "@/schemas/dominios/dominos.schema.js";

export class RacaCorController extends DominioController{
    constructor(){
        super(
            new RacaCorService(),
            new DominioSchemas(10)
        )
    }
}