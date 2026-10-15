import { PaisController } from "@/controllers/pais.controller.js";
import { PaisSchemas } from "@/schemas/pais.Schema.js";
import { CrudRoutes } from "@/routes/crud.routes.js";

export class PaisRoutes extends CrudRoutes<PaisController>{
    
    constructor(){

        super(
            new PaisController()
        )

        this.registrarSchema()
        this.registrarRotasCrud()
    }
}