import { prisma } from "../../lib/prisma.js";
import { DominioServices } from "./dominios.service.js";

export class NivelService extends DominioServices {
    constructor(){
        super(
            prisma.nivel,
            "Nível",
            "id_nivel",
        )
    }
}