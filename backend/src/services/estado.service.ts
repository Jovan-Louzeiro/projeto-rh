import { prisma } from "@/lib/prisma.js"
import { CRUDServices } from "@/services/crud.service.js"

export class EstadoService <TCreate, TUpdate> extends CRUDServices <TCreate, TUpdate>{

    constructor(){
        super(
            prisma.estado,
            "Estado",
            "id_estado"
        )
    }

}