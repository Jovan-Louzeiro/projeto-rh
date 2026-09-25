import { prisma } from "../../lib/prisma.js";
import { DominioServices } from "./dominios.service.js";

export class RacaCorService extends DominioServices {
    constructor(){
        super(
            prisma.racaCor,
            "Raça/Cor",
            "id_racacor",
        )
    }
}