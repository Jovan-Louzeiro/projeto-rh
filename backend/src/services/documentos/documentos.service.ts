import { prismaModel } from "../../types/crud.types.js";
import { CRUDServices } from "../crud.service.js";

export class DocumentosServices<TCreate, TUpdate> extends CRUDServices<TCreate, TUpdate>{

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