import { MunicipioController } from "@/controllers/municipio.controller.js";
import { MunicipioSchema } from "@/schemas/municipio.schema.js";
import { CrudRoutes } from "@/routes/crud.routes.js";

export class MunicipioRouter extends CrudRoutes<MunicipioSchema>{
    constructor(){
        super(
            new MunicipioController(),
            new MunicipioSchema
        )
    }
}