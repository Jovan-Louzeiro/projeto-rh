import { EstadoController } from "../controllers/estado.controller.js";
import { EstadoSchemas } from "../schemas/estado.schema.js";
import { CrudRoutes } from "./crud.routes.js";

export class EstadoRouter extends CrudRoutes<EstadoSchemas>{

    constructor(){
        super(
            new EstadoController(),
            new EstadoSchemas()
        )
    }
}