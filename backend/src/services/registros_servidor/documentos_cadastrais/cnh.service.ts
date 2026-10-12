import { prisma } from "@/lib/prisma.js";
import { DocumentosCadastraisServices } from "@/services/registros_servidor/documentos_cadastrais/documentosCadastrais.service.js";

export class CnhService<TCreate, TUpdate> extends DocumentosCadastraisServices<TCreate, TUpdate>{

    constructor(){
        super(
            prisma.cNH,
            "CNH"
        )
    }

}