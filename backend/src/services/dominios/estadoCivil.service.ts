import { prisma } from "../../lib/prisma.js";
import { DominioServices } from "./dominios.service.js";

export class EstadoCivilService extends DominioServices {
    constructor(){
        super(
            prisma.estadoCivil,
            "Estado Civíl",
            "id_estado_civil",
        )
    }
}