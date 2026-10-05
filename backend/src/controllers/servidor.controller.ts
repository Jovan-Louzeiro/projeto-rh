import { ServidorService } from "../services/servidr.service.js";
import { CrudController } from "./crud.controller.js";

export class ServidorController extends CrudController{

    constructor(){
        super(
            new ServidorService()
        )
    }

}