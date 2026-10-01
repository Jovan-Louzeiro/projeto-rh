import { prisma } from "../../lib/prisma.js";
import { DominioServices } from "./dominios.service.js";

export class CargoService<TCreate, TUpdate> extends DominioServices<TCreate, TUpdate> {
    constructor(){
        super(
            prisma.cargo,
            "Cargo",
            "id_cargo",
        )
    }
}