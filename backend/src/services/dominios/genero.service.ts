import { prisma } from "../../lib/prisma.js";
import { DominioServices } from "./dominios.service.js";

export class GeneroServices<TCreate, TUpdate> extends DominioServices<TCreate, TUpdate> {
    constructor(){
        super(
            prisma.genero,
            "Gênero",
            "id_genero",
        )
    }
}