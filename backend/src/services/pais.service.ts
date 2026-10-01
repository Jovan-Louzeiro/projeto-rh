import { RegistroEmUso, RegistroJaExistenteError, RegistroNaoEncontradoError } from "../errors/dominios.errors.js";
import { prisma } from "../lib/prisma.js";
import { CRUDServices } from "./crud.service.js";

export class PaisService <TCreate, TUpdate> extends CRUDServices <TCreate, TUpdate>{
    constructor(){
        super(
            prisma.pais,
            "País",
            "id_pais"
        )
    }
}