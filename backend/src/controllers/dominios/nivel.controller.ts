import { NivelService } from "@/services/dominios/nivel.service.js";
import { DominioController } from "@/controllers/dominios/dominios.controller.js";
import { DominioSchemas } from "@/schemas/dominios/dominos.schema.js";

export class NivelController extends DominioController{
    constructor(){
        super(
            new NivelService(),
            new DominioSchemas(10)
        )
    }
}