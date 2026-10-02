import { prisma } from "../lib/prisma.js";
import { CRUDServices } from "./crud.service.js";

export class MunicipioService<TCreate, TUpdate> extends CRUDServices<TCreate, TUpdate>{
    constructor(){
        super(
            prisma.municipio,
            "Município",
            "id_municipio"
        )
    }
}