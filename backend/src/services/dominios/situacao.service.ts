import { prisma } from "../../lib/prisma.js";
import { DominioServices } from "./dominios.service.js";

export class SituacaoService extends DominioServices {
    constructor(){
        super(
            prisma.situacao,
            "Situação Atual",
            "id_situacao",
        )
    }
}