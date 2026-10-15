import { EstadoCivilService } from "@/services/dominios/estadoCivil.service.js";
import { DominioController } from "@/controllers/dominios/dominios.controller.js";
import { DominioSchemas } from "@/schemas/dominios/dominos.schema.js";

export class EstadoCivilController extends DominioController{
    constructor(){
        super(
            new EstadoCivilService(),
            new DominioSchemas(15)
    )
    }
}