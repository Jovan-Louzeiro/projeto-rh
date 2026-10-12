import { ZonaEnderecoService } from "@/services/dominios/zonaEndereco.service.js";
import { DominioController } from "@/controllers/dominios/dominios.controller.js";

export class ZonaEnderecoController extends DominioController{
    constructor(){
        super(new ZonaEnderecoService())
    }
}