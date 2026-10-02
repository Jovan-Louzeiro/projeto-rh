import { EstadoService } from "../services/estado.service.js";
import { CrudController } from "./crud.controller.js";

export class EstadoController extends CrudController{
    constructor(){
        super(new EstadoService())
    }
}