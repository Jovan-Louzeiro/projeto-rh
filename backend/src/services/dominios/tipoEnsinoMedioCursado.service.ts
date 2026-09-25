import { prisma } from "../../lib/prisma.js";
import { DominioServices } from "./dominios.service.js";

export class TipoEnsinoMedioCursadoService extends DominioServices {
    constructor(){
        super(
            prisma.tipoEnsinoMedioCursado,
            "Tipo de Ensino Médio Cursado",
            "id_tipo_ensino_medio_cursado",
        )
    }
}