import { ServidorService } from "../services/servidor.service.js";
import { CrudController } from "./crud.controller.js";

export class ServidorController extends CrudController{

    constructor(){
        super(
            new ServidorService()
        )
    }

}