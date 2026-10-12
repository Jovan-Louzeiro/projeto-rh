import { prisma } from "@/lib/prisma.js";
import { DominioServices } from "@/services/dominios/dominios.service.js";

export class TipoEnsinoMedioCursadoService<TCreate, TUpdate> extends DominioServices<TCreate, TUpdate> {
    constructor(){
        super(
            prisma.tipoEnsinoMedioCursado,
            "Tipo de Ensino Médio Cursado",
            "id_tipo_ensino_medio_cursado",
        )
    }
}