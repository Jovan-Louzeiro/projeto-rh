import { MunicipioController } from "@/controllers/municipio.controller.js";
import { MunicipioSchema } from "@/schemas/municipio.schema.js";
import { CrudRoutes } from "@/routes/crud.routes.js";

export class MunicipioRouter extends CrudRoutes<MunicipioController>{
    constructor(){
        super(
            new MunicipioController()
        )

        this.registrarSchema()
        this.registrarRotasCrud()
    }
}