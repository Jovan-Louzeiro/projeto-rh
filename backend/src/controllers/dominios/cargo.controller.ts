import { CargoService } from "@/services/dominios/cargo.service.js";
import { DominioController } from "@/controllers/dominios/dominios.controller.js";
import { DominioSchemas } from "@/schemas/dominios/dominos.schema.js";

export class CargoController extends DominioController{
    constructor(){
        super(
            new CargoService(),
            new DominioSchemas(50)
        )
    }
}