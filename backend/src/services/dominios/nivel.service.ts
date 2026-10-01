import { prisma } from "../../lib/prisma.js";
import { DominioServices } from "./dominios.service.js";

export class NivelService<TCreate, TUpdate> extends DominioServices<TCreate, TUpdate> {
    constructor(){
        super(
            prisma.nivel,
            "Nível",
            "id_nivel",
        )
    }
}