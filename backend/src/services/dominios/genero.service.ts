import { prisma } from "../../lib/prisma.js";
import { DominioServices } from "./dominios.service.js";

export class GeneroServices extends DominioServices {
    constructor(){
        super(
            prisma.genero,
            "Gênero",
            "id_genero",
        )
    }
}