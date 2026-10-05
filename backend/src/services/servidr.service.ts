import { prisma } from "../lib/prisma.js";
import { CRUDServices } from "./crud.service.js";

export class ServidorService<Tcreate, Tupdate> extends CRUDServices<Tcreate, Tupdate>{

    constructor(){
        super(
            prisma.servidor,
            "Servidor",
            "id_servidor"
        )
    }
}