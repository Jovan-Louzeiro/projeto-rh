import { DominioServices } from "@/services/dominios/dominios.service.js";
import { CrudController } from "@/controllers/crud.controller.js";

export class DominioController extends CrudController {

    constructor(DominioServices: DominioServices<any, any>){
        super(
            DominioServices
        )
    }
}