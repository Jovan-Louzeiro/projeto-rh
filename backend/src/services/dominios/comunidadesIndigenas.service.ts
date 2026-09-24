import { dominiosConfig } from "../../config/dominios.config.js";
import { prisma } from "../../lib/prisma.js";
import { prismaModel, VerificacaoUso } from "../../types/dominio.types.js";
import { DominioServices } from "./dominios.service.js";

export class comunidadeIndigenaService extends DominioServices {
    constructor(){
        super(
            prisma.comunidadeIndigena,
            {
                nome: "Comunidade Indígena",
                idField: "id_comunidade_indigena",
            }
        )
    }
}