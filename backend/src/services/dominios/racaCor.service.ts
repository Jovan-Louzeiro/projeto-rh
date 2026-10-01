import { prisma } from "../../lib/prisma.js";
import { DominioServices } from "./dominios.service.js";

export class RacaCorService<TCreate, TUpdate> extends DominioServices<TCreate, TUpdate> {
    constructor(){
        super(
            prisma.racaCor,
            "Raça/Cor",
            "id_racacor",
        )
    }
}