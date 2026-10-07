import { prisma } from "../../lib/prisma.js";
import { DocumentosServices } from "./documentos.service.js";

export class TituloEleitorService<TCreate, TUpdate> extends DocumentosServices<TCreate, TUpdate>{

    constructor(){
        super(
            prisma.tituloEleitor,
            "Titulo de Eleito",
            "servidor_id"
        )
    }

}