import { prisma } from "@/lib/prisma.js";
import { DominioServices } from "@/services/dominios/dominios.service.js";

export class FuncaoService<TCreate, TUpdate> extends DominioServices<TCreate, TUpdate> {
    constructor(){
        super(
            prisma.funcao,
            "Função",
            "id_funcao",
        )
    }
}