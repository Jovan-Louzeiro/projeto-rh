import { MunicipioService } from "@/services/municipio.service.js";
import { CrudController } from "@/controllers/crud.controller.js";
import { MunicipioSchema } from "@/schemas/municipio.schema.js";

export class MunicipioController extends CrudController<MunicipioService, MunicipioSchema>{
    constructor(){
        super(
            new MunicipioService(),
            new MunicipioSchema()
        )
    }
}