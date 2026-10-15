import { prisma } from "@/lib/prisma.js";
import { TituloEleitorCreate, TituloEleitorSchemas, TituloEleitorUpdate } from "@/schemas/documentos/tituloEleitor.schema.js";
import { DocumentosServices } from "@/services/documentos/documentos.service.js";

export class TituloEleitorService extends DocumentosServices<TituloEleitorCreate, TituloEleitorUpdate>{

    constructor(){
        super(
            prisma.tituloEleitor,
            "Titulo de Eleito"
        )
    }

}