import { prismaModel } from "../../types/crud.types.js";
import { CRUDServices } from "../crud.service.js";

export class DominioServices<TCreate, TUpdate> extends CRUDServices<TCreate, TUpdate> {

    constructor(
        prismaModel: prismaModel,
        nome: string,
        idField: string,
    ) {
        super(prismaModel, nome, idField);
    }
}