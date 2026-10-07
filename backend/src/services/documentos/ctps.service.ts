import { prisma } from "../../lib/prisma.js";
import { DocumentosServices } from "./documentos.service.js";

export class CtpsService<TCreate, TUpdate> extends DocumentosServices<TCreate, TUpdate>{

    constructor(){
        super(
            prisma.cTPS,
            "CTPS",
            "servidor_id"
        )
    }

}