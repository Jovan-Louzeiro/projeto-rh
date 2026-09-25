import { prisma } from "../../lib/prisma.js";
import { DominioServices } from "./dominios.service.js";

export class DepartamentoService extends DominioServices {
    constructor(){
        super(
            prisma.departamento,
            "Departamento",
            "id_departamento",
        )
    }
}