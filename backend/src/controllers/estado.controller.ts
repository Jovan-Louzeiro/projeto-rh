import { EstadoService } from "@/services/estado.service.js";
import { CrudController } from "@/controllers/crud.controller.js";
import type { EstadoCreate, EstadoUpdate } from "@/schemas/estado.schema.js";

export class EstadoController extends CrudController<EstadoService<EstadoCreate, EstadoUpdate>>{
    constructor(){
        super(new EstadoService<EstadoCreate, EstadoUpdate>())
    }
}