import { prisma } from "@/lib/prisma.js";
import { DominioServices } from "@/services/dominios/dominios.service.js";

export class TipoVinculoService<TCreate, TUpdate> extends DominioServices<TCreate, TUpdate> {
    constructor(){
        super(
            prisma.tipoVinculo,
            "Tipo de vínculo",
            "id_tipo_vinculo",
        )
    }
}