import { prisma } from "../../lib/prisma.js";
import { DominioServices } from "./dominios.service.js";

export class SexoService<TCreate, TUpdate> extends DominioServices<TCreate, TUpdate> {
    constructor(){
        super(
            prisma.sexo,
            "Sexo",
            "id_sexo",
        )
    }
}