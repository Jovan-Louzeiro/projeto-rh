import { PaisService } from "../services/pais.service.js";
import { CrudController } from "./crud.controller.js";

export class PaisController extends CrudController{

    constructor(){
        super(new PaisService())
    }

}