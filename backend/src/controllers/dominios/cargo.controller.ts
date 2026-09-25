import { CargoService } from "../../services/dominios/cargo.service.js";
import { DominioController } from "./dominios.controller.js";

export class CargoController extends DominioController{
    constructor(){
        super(new CargoService())
    }
}