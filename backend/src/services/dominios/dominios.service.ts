import { prismaModel } from "@/types/crud.types.js";
import { CRUDServices } from "@/services/crud.service.js";
import { DominioCreate, DominioSchemas, DominioUpdate } from "@/schemas/dominios/dominos.schema.js";

export class DominioServices<TDominioCreate = DominioCreate, TDominioUpdate = DominioUpdate> extends CRUDServices<TDominioCreate, TDominioUpdate> {

    constructor(
        prismaModel: prismaModel,
        nome: string,
        idField: string,
    ) {
        super(prismaModel, nome, idField);
    }
    
}