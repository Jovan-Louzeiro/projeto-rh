import { PaisController } from "@/controllers/pais.controller.js";
import { PaisSchemas } from "@/schemas/pais.Schema.js";
import { CrudRoutes } from "@/routes/crud.routes.js";
import { autorizacoesCadastroRh } from "@/types/crud.types.js";

export class PaisRoutes extends CrudRoutes<PaisController>{
    
    constructor(){

        super(
            new PaisController(),
            autorizacoesCadastroRh
        )

        this.registrarSchema()
        this.registrarRotasCrud()
    }
}