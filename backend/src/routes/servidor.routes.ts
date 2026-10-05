import { ServidorController } from "../controllers/servidor.controller.js";
import { ServidorSchemas } from "../schemas/servidor.schemas.js";
import { CrudRoutes } from "./crud.routes.js";

export class ServidorRouter extends CrudRoutes<ServidorSchemas>{

    constructor(){
        super(
            new ServidorController(),
            new ServidorSchemas()
        )
    }
}