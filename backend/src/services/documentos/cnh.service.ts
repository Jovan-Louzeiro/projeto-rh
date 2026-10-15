import { prisma } from "@/lib/prisma.js";
import { CnhCreate, CnhUpdate } from "@/schemas/documentos/cnh.schemas.js";
import { DocumentosServices } from "@/services/documentos/documentos.service.js";

export class CnhService extends DocumentosServices<CnhCreate, CnhUpdate>{

    constructor(){
        super(
            prisma.cNH,
            "CNH"
        )
    }

}