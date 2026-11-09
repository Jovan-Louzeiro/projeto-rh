import { prisma } from "@/lib/prisma.js";
import { DominioServices } from "@/services/dominios/dominios.service.js";

export class TipoRequerimentoService extends DominioServices{

    constructor(){

        super(
            prisma.tipoRequerimento,
            "Tipo de Requerimento",
            "id_tipo_requerimento"
        )

    }

}