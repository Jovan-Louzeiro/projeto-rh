import { PaisService } from "@/services/pais.service.js";
import { CrudController } from "@/controllers/crud.controller.js";

export class PaisController extends CrudController{

    private paisService: PaisService

    constructor(){
        const service = new PaisService()

        super(service)

        this.paisService = service
    }
}