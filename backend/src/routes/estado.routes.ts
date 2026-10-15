import { EstadoController } from "@/controllers/estado.controller.js";
import { EstadoSchemas } from "@/schemas/estado.schema.js";
import { CrudRoutes } from "@/routes/crud.routes.js";

export class EstadoRouter extends CrudRoutes<EstadoController>{

    constructor(){
        super(
            new EstadoController()
        )

        this.registrarSchema()
        this.registrarRotasCrud()

    }
}