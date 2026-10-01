import { prisma } from "../../lib/prisma.js";
import { DominioServices } from "./dominios.service.js";

export class DepartamentoService<TCreate, TUpdate> extends DominioServices<TCreate, TUpdate> {
    constructor(){
        super(
            prisma.departamento,
            "Departamento",
            "id_departamento",
        )
    }
}