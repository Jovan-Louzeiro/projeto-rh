import { prismaModel, VerificacaoUso } from "../../types/dominio.types.js";
import { RegistroEmUso, RegistroJaExistenteError, RegistroNaoEncontradoError } from "../../errors/dominios.errors.js";
import { CRUDServices } from "../crud.service.js";

export class DominioServices extends CRUDServices {
    constructor(
        prismaModel: prismaModel,
        config: {
            nome: string;
            idField: string;
            verificacoesUso?: VerificacaoUso[];
        }
    ) {
        super(prismaModel, config);
    }
}