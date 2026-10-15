import { EstadoService } from "@/services/estado.service.js";
import { CrudController } from "@/controllers/crud.controller.js";
import { EstadoCreate, EstadoSchemas, EstadoUpdate } from "@/schemas/estado.schema.js";

export class EstadoController extends CrudController<EstadoService, EstadoSchemas>{
    constructor(){
        super(
            new EstadoService(),
            new EstadoSchemas()
        )
    }
}