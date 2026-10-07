import { prisma } from "../../lib/prisma.js";
import { DocumentosServices } from "./documentos.service.js";

export class CertidaoService<TCreate, TUpdate> extends DocumentosServices<TCreate, TUpdate>{

    constructor(){
        super(
            prisma.certidao,
            "Certidão",
            "servidor_id"
        )
    }
}