import { PaisService } from "@/services/pais.service.js";
import { CrudController } from "@/controllers/crud.controller.js";
import { PaisSchemas } from "@/schemas/pais.Schema.js";

export class PaisController extends CrudController<PaisService, PaisSchemas>{

    constructor(){

        super(
            new PaisService(),
            new PaisSchemas()
        )

    }
}