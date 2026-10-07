import { prisma } from "../../lib/prisma.js";
import { IdentidadeCreate, IdentidadeUpdate } from "../../schemas/documentos/identidade.schemas.js";
import { DocumentosServices } from "./documentos.service.js";

export class IdentidadeService extends DocumentosServices<IdentidadeCreate, IdentidadeUpdate>{

    constructor(){
        super(
            prisma.identidade,
            "Identidade",
            "servidor_id"
        )
    }

    async atualizar (id: number, data: IdentidadeUpdate){

        console.log(data)
        
        if(data.tipo_identidade === "CIN"){
            data.numero = null
        }

        console.log(data)

        return super.atualizar(id, data)
    }

}