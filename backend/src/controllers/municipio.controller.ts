import { MunicipioService } from "@/services/municipio.service.js";
import { CrudController } from "@/controllers/crud.controller.js";

export class MunicipioController extends CrudController{
    constructor(){
        super(
            new MunicipioService()
        )
    }
}