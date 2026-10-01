import { prisma } from "../../lib/prisma.js";
import { DominioServices } from "./dominios.service.js";

export class ZonaEnderecoService<TCreate, TUpdate> extends DominioServices<TCreate, TUpdate> {
    constructor(){
        super(
            prisma.zonaEndereco,
            "Zona de Endereço",
            "id_zona_endereco",
        )
    }
}