import { DominioController } from "@/controllers/dominios/dominios.controller.js";
import { DominioSchemas } from "@/schemas/dominios/dominos.schema.js";
import { Autorizacoes } from "@/types/crud.types.js";
import { CrudRoutes } from "@/routes/crud.routes.js";

export class DominiosRoutes extends CrudRoutes<DominioController>{

    constructor(
        DominioController: DominioController,
        autorizacoes?: Autorizacoes
    ){
        super(
            DominioController,
            autorizacoes
        )


        this.registrarSchema()
        
        this.registrarRotasCrud()

    }

}