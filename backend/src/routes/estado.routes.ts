import { EstadoController } from "@/controllers/estado.controller.js";
import { EstadoSchemas } from "@/schemas/estado.schema.js";
import { CrudRoutes } from "@/routes/crud.routes.js";
import { autorizacoesCadastroRh } from "@/types/crud.types.js";

export class EstadoRouter extends CrudRoutes<EstadoController>{

    constructor(){
        super(
            new EstadoController(),
            autorizacoesCadastroRh
        )

        this.registrarSchema()
        this.registrarRotasCrud()

    }
}