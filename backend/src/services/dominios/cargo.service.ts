import { prisma } from "../../lib/prisma.js";
import { DominioServices } from "./dominios.service.js";

export class CargoService extends DominioServices {
    constructor(){
        super(
            prisma.cargo,
            "Cargo",
            "id_cargo",
        )
    }
}