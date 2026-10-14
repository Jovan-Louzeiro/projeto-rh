import { prisma } from "@/lib/prisma.js";
import type { MunicipioCreate, MunicipioUpdate } from "@/schemas/municipio.schema.js";
import { CRUDServices } from "@/services/crud.service.js";

export class MunicipioService extends CRUDServices<MunicipioCreate, MunicipioUpdate>{
    constructor(){
        super(
            prisma.municipio,
            "Município",
            "id_municipio"
        )
    }
}