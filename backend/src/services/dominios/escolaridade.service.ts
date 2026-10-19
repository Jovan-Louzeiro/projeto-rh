import { prisma } from "@/lib/prisma.js";
import { DominioServices } from "@/services/dominios/dominios.service.js";

export class EscolaridadeService<TCreate, TUpdate> extends DominioServices<TCreate, TUpdate>{
    constructor(){
        super(
            prisma.escolaridade,
            "Escolaridade",
            "id_escolaridade"
        )
    }
}