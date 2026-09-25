import { prisma } from "../../lib/prisma.js";
import { DominioServices } from "./dominios.service.js";

export class SexoService extends DominioServices {
    constructor(){
        super(
            prisma.sexo,
            "Sexo",
            "id_sexo",
        )
    }
}