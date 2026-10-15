import { ZonaEnderecoService } from "@/services/dominios/zonaEndereco.service.js";
import { DominioController } from "@/controllers/dominios/dominios.controller.js";
import { DominioSchemas } from "@/schemas/dominios/dominos.schema.js";

export class ZonaEnderecoController extends DominioController{
    constructor(){
        super(
            new ZonaEnderecoService(),
            new DominioSchemas(10)
        )
    }
}