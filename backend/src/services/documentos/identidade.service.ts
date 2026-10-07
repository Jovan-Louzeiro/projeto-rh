import { prisma } from "../../lib/prisma.js";
import { DocumentosServices } from "./documentos.service.js";

export class IdentidadeService<TCreate, TUpdate> extends DocumentosServices<TCreate, TUpdate>{

    constructor(){
        super(
            prisma.identidade,
            "Identidade",
            "servidor_id"
        )
    }

}