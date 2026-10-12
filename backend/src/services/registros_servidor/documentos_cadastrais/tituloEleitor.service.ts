import { prisma } from "@/lib/prisma.js";
import { DocumentosCadastraisServices } from "@/services/registros_servidor/documentos_cadastrais/documentosCadastrais.service.js";

export class TituloEleitorService<TCreate, TUpdate> extends DocumentosCadastraisServices<TCreate, TUpdate>{

    constructor(){
        super(
            prisma.tituloEleitor,
            "Titulo de Eleito"
        )
    }

}