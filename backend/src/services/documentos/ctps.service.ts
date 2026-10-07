import { prisma } from "../../lib/prisma.js";
import { CtpsCreate, CtpsUpdate } from "../../schemas/documentos/ctps.schemas.js";
import { DocumentosServices } from "./documentos.service.js";

export class CtpsService extends DocumentosServices<CtpsCreate, CtpsUpdate>{

    constructor(){
        super(
            prisma.cTPS,
            "CTPS",
            "servidor_id"
        )
    }

    async atualizar(id: number, data: CtpsUpdate){
        
        if(data.tipo_ctps){
            data.numero = null,
            data.serie = null,
            data.uf_ctps_id = null
        }

        return super.atualizar(id, data)
    }

}