import { GeneroServices } from "@/services/dominios/genero.service.js";
import { DominioController } from "@/controllers/dominios/dominios.controller.js";
import { DominioSchemas } from "@/schemas/dominios/dominos.schema.js";

export class GeneroController extends DominioController{
    constructor(){
        super(
            new GeneroServices(),
            new DominioSchemas(20)
        )
    }
}