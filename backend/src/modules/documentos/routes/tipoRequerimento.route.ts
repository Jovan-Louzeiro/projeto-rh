import { DominioController } from "@/controllers/dominios/dominios.controller.js";
import { TipoRequerimentoController } from "@/modules/documentos/controllers/tipoRequerimento.controller.js";
import { DominiosRoutes } from "@/routes/dominios/dominio-base.routes.js";
import dominiosRoutes from "@/routes/dominios/dominios.routes.js";

export class TipoRequerimentoRouter extends DominiosRoutes{

    constructor(){

        super(
            new TipoRequerimentoController()
        )

    }

}