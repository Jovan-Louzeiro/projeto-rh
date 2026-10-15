import { ComunidadeIndigenaService } from "@/services/dominios/comunidadesIndigenas.service.js";
import { DominioController } from "@/controllers/dominios/dominios.controller.js";
import { DominioSchemas } from "@/schemas/dominios/dominos.schema.js";

export class ComunidadeIndigenaController extends DominioController{
    constructor(){
        super(
            new ComunidadeIndigenaService(),
            new DominioSchemas(50)
        )
    }
}