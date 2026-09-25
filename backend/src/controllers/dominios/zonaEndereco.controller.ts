import { ZonaEnderecoService } from "../../services/dominios/zonaEndereco.service.js";
import { DominioController } from "./dominios.controller.js";

export class ZonaEnderecoController extends DominioController{
    constructor(){
        super(new ZonaEnderecoService())
    }
}