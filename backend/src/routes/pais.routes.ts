import { PaisController } from "../controllers/pais.controller.js";
import { autorizar } from "../middlewares/auth.js";
import { PaisSchemas } from "../schemas/pais.Schema.js";
import { CrudRoutes } from "./crud.routes.js";

export class PaisRoutes extends CrudRoutes<PaisSchemas>{

    private paisController: PaisController
    

    constructor(){

        const controller = new PaisController()

        super(
            controller,
            new PaisSchemas()
        )

        this.paisController = controller
    }
}