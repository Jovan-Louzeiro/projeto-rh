import { prisma } from "../../lib/prisma.js";
import { DocumentosServices } from "./documentos.service.js";

export class CnhService<TCreate, TUpdate> extends DocumentosServices<TCreate, TUpdate>{

    constructor(){
        super(
            prisma.cNH,
            "CNH",
            "servidor_id"
        )
    }

}