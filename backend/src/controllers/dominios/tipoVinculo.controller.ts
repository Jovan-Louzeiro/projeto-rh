import { TipoVinculoService } from "@/services/dominios/tipoVinculo.service.js";
import { DominioController } from "@/controllers/dominios/dominios.controller.js";
import { DominioSchemas } from "@/schemas/dominios/dominos.schema.js";

export class TipoVinculoController extends DominioController{
    constructor(){
        super(
            new TipoVinculoService(),
            new DominioSchemas(50)
        )
    }
}