import { ZonaEnderecoController } from "@/controllers/dominios/zonaEndereco.controller.js";
import { DominioSchemas } from "@/schemas/dominios/dominos.schema.js";
import { DominiosRoutes } from "@/routes/dominios/dominio-base.routes.js";

export class ZonaEnderecoRouter extends DominiosRoutes{
    constructor(){
        super(
            new ZonaEnderecoController(),
            new DominioSchemas(10)
    )
    }
}