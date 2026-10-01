import { prisma } from "../../lib/prisma.js";
import { DominioServices } from "./dominios.service.js";

export class SituacaoService<TCreate, TUpdate> extends DominioServices<TCreate, TUpdate> {
    constructor(){
        super(
            prisma.situacao,
            "Situação Atual",
            "id_situacao",
        )
    }
}