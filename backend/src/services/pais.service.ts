import { prisma } from "@/lib/prisma.js";
import type { PaisCreate, PaisUpdate } from "@/schemas/pais.Schema.js";
import { CRUDServices } from "@/services/crud.service.js";

export class PaisService extends CRUDServices<PaisCreate, PaisUpdate>{
    constructor(){
        super(
            prisma.pais,
            "País",
            "id_pais"
        )
    }
}