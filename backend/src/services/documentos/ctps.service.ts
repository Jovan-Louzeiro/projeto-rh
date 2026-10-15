import { prisma } from "@/lib/prisma.js";
import type { CtpsCreate, CtpsUpdate } from "@/schemas/documentos/ctps.schemas.js";
import { DocumentosServices } from "@/services/documentos/documentos.service.js";

export class CtpsService extends DocumentosServices<CtpsCreate, CtpsUpdate>{

    constructor(){
        super(
            prisma.cTPS,
            "CTPS",
        )
    }

    async atualizar(usuario: string, id: number,  data: CtpsUpdate){
        
        if(data.tipo_ctps == "NOVO"){
            data.numero = null,
            data.serie = null,
            data.uf_ctps_id = null
        }

        return super.atualizar(usuario, id, data)
    }

}