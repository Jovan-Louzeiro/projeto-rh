import { DominioController } from "@/controllers/dominios/dominios.controller.js";
import { TipoRequerimentoService } from "@/modules/documentos/services/tipoRequerimento.service.js";
import { DominioSchemas } from "@/schemas/dominios/dominos.schema.js";

export class TipoRequerimentoController extends DominioController<TipoRequerimentoService>{

    constructor(){

        super(
            new TipoRequerimentoService(),
            new DominioSchemas(50)
        )

    }

}