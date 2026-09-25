import { prisma } from "../../lib/prisma.js";
import { DominioServices } from "./dominios.service.js";

export class FuncaoService extends DominioServices {
    constructor(){
        super(
            prisma.funcao,
            "Função",
            "id_funcao",
        )
    }
}