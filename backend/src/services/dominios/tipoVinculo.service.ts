import { prisma } from "../../lib/prisma.js";
import { DominioServices } from "./dominios.service.js";

export class TipoVinculoService extends DominioServices {
    constructor(){
        super(
            prisma.tipoVinculo,
            "Tipo de vínculo",
            "id_tipo_vinculo",
        )
    }
}