import { prismaModel, VerificacaoUso } from "../../types/dominio.types.js";
import { CRUDServices } from "../crud.service.js";

export class DominioServices extends CRUDServices {
    constructor(
        prismaModel: prismaModel,
        nome: string,
        idField: string,
        verificacoesUso?: VerificacaoUso[]
    ) {
        super(prismaModel, nome, idField, verificacoesUso);
    }
}