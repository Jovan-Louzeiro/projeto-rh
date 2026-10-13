import { prismaModel } from "@/types/crud.types.js";
import { RegistrosServidorServices } from "@/services/registros_servidor/registrosServidor.service.js";

export class DocumentosCadastraisServices<TCreate, TUpdate> extends RegistrosServidorServices<TCreate, TUpdate>{

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