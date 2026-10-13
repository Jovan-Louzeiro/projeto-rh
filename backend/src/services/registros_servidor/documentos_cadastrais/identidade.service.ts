import { prisma } from "@/lib/prisma.js";
import { IdentidadeCreate, IdentidadeUpdate } from "@/schemas/registros_servidor/documentos_cadastrais/identidade.schemas.js";
import { DocumentosCadastraisServices } from "@/services/registros_servidor/documentos_cadastrais/documentosCadastrais.service.js";

export class IdentidadeService extends DocumentosCadastraisServices<IdentidadeCreate, IdentidadeUpdate>{

    constructor(){
        super(
            prisma.identidade,
            "Identidade"
        )
    }

    async atualizar (id: number, usuario: string, data: IdentidadeUpdate){

        console.log(data)
        
        if(data.tipo_identidade === "CIN"){
            data.numero = null
        }

        console.log(data)

        return super.atualizar(id, usuario, data)
    }

}