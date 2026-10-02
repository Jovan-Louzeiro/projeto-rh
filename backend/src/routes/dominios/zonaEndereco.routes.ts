import { ZonaEnderecoController } from "../../controllers/dominios/zonaEndereco.controller.js";
import { DominioSchemas } from "../../schemas/dominos.schema.js";
import { DominiosRoutes } from "./dominio-base.routes.js";

export class ZonaEnderecoRouter extends DominiosRoutes{
    constructor(){
        super(
            new ZonaEnderecoController(),
            new DominioSchemas(10)
    )
    }
}