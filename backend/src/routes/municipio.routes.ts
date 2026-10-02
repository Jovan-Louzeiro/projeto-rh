import { MunicipioController } from "../controllers/municipio.controller.js";
import { MunicipioSchema } from "../schemas/municipio.schema.js";
import { CrudRoutes } from "./crud.routes.js";

export class MunicipioRouter extends CrudRoutes<MunicipioSchema>{
    constructor(){
        super(
            new MunicipioController(),
            new MunicipioSchema
        )
    }
}