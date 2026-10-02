import { MunicipioService } from "../services/municipio.service.js";
import { CrudController } from "./crud.controller.js";

export class MunicipioController extends CrudController{
    constructor(){
        super(
            new MunicipioService()
        )
    }
}