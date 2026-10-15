import { prisma } from "@/lib/prisma.js"
import { EstadoCreate, EstadoUpdate } from "@/schemas/estado.schema.js"
import { CRUDServices } from "@/services/crud.service.js"

export class EstadoService extends CRUDServices <EstadoCreate, EstadoUpdate>{

    constructor(){
        super(
            prisma.estado,
            "Estado",
            "id_estado"
        )
    }

}