import { SexoService } from "@/services/dominios/sexo.service.js";
import { DominioController } from "@/controllers/dominios/dominios.controller.js";
import { DominioSchemas } from "@/schemas/dominios/dominos.schema.js";

export class SexoController extends DominioController {
    constructor() {
        super(
            new SexoService(),
            new DominioSchemas(10)
        )
    }
}