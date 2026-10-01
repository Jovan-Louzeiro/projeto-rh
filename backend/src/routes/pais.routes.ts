import { PaisController } from "../controllers/pais.controller.js";
import { PaisSchemas } from "../schemas/pais.Schema.js";
import { CurdRoutes } from "./crud.routes.js";

export class PaisRoutes extends CurdRoutes{

    constructor(){
        super(
            new PaisController(),
            new PaisSchemas()
        )
    }

}