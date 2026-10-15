import { DominioServices } from "@/services/dominios/dominios.service.js";
import { CrudController } from "@/controllers/crud.controller.js";
import { DominioSchemas } from "@/schemas/dominios/dominos.schema.js";

export class DominioController<
    TDominioServices extends DominioServices = DominioServices,
    TDominioSchemas extends DominioSchemas = DominioSchemas
> extends CrudController<TDominioServices, TDominioSchemas> {

    constructor(
        DominioServices: TDominioServices,
        DominioSchemas: TDominioSchemas
    ) {
        super(
            DominioServices,
            DominioSchemas
        )
    }
}