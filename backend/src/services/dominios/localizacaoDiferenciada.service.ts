import { prisma } from "../../lib/prisma.js";
import { DominioServices } from "./dominios.service.js";

export class LocalizacaoDiferenciadaService<TCreate, TUpdate> extends DominioServices<TCreate, TUpdate> {
    constructor(){
        super(
            prisma.localizacaoDiferenciada,
            "Localização Diferenciada",
            "id_localizacao_diferenciada",
        )
    }
}