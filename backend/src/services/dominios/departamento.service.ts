import { prisma } from "@/lib/prisma.js";
import { DepartamentoCreate, DepartamentoUpdate } from "@/schemas/dominios/departamento.schema.js";
import { DominioServices } from "@/services/dominios/dominios.service.js";

export class DepartamentoService extends DominioServices<DepartamentoCreate, DepartamentoUpdate> {
    constructor(){
        super(
            prisma.departamento,
            "Departamento",
            "id_departamento",
        )
    }
}