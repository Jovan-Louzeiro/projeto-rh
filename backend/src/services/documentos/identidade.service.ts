import { prisma } from "@/lib/prisma.js";
import type { IdentidadeCreate, IdentidadeUpdate } from "@/schemas/documentos/identidade.schemas.js";
import { DocumentosServices } from "@/services/documentos/documentos.service.js";

export class IdentidadeService extends DocumentosServices<IdentidadeCreate, IdentidadeUpdate>{

    constructor(){
        super(
            prisma.identidade,
            "Identidade"
        )
    }

    async atualizar (usuario: string, id: number, data: IdentidadeUpdate){
        
        if(data.tipo_identidade === "CIN"){
            data.numero = null
        }

        return super.atualizar(usuario, id, data)
    }

}