import { prisma } from "@/lib/prisma.js";
import type { CtpsCreate, CtpsUpdate } from "@/schemas/registros_servidor/documentos_cadastrais/ctps.schemas.js";
import { DocumentosCadastraisServices } from "@/services/registros_servidor/documentos_cadastrais/documentosCadastrais.service.js";

export class CtpsService extends DocumentosCadastraisServices<CtpsCreate, CtpsUpdate>{

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