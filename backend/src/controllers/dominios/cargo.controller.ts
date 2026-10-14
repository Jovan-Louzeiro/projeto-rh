import { CargoService } from "@/services/dominios/cargo.service.js";
import { DominioController } from "@/controllers/dominios/dominios.controller.js";

export class CargoController extends DominioController{
    constructor(){
        super(new CargoService())
    }
}