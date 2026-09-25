import { prisma } from "../../lib/prisma.js";
import { DominioServices } from "./dominios.service.js";

export class LocalizacaoDiferenciadaService extends DominioServices {
    constructor(){
        super(
            prisma.localizacaoDiferenciada,
            "Localização Diferenciada",
            "id_localizacao_diferenciada",
        )
    }
}