import { prisma } from "../../lib/prisma.js";
import { DominioServices } from "./dominios.service.js";

export class ComunidadeIndigenaService extends DominioServices {
    constructor(){
        super(
            prisma.comunidadeIndigena,
            "Comunidade Indígena",
            "id_comunidade_indigena",
        )
    }
}