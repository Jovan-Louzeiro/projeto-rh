import { prisma } from "../../lib/prisma.js";
import { DominioServices } from "./dominios.service.js";

export class EscolaridadeService extends DominioServices{
    constructor(){
        super(
            prisma.escolaridade,
            "Escolaridade",
            "id_comunidade_indigena"
        )
    }
}