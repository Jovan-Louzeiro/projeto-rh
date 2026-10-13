import { prismaModel } from "@/types/crud.types.js";
import { CRUDServices } from "@/services/crud.service.js";

export class RegistrosServidorServices<TCreate, TUpdate> extends CRUDServices<TCreate, TUpdate>{

    constructor(
        prismaModel: prismaModel,
        nome: string,
        idServidor: string
    ){
        super(
            prismaModel,
            nome,
            idServidor
        )
    }

}