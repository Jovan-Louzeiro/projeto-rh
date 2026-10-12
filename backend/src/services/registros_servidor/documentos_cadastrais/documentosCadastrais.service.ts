import { prismaModel } from "@/types/crud.types.js";
import { registroServidorServices } from "@/services/registros_servidor/registrosServidor.service.js";

export class DocumentosCadastraisServices<TCreate, TUpdate> extends registroServidorServices<TCreate, TUpdate>{

    constructor(
        prismaModel: prismaModel,
        nome: string,
    ){
        super(
            prismaModel,
            nome,
            "servidor_id"
        )
    }

}