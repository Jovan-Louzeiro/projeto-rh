import { DepartamentoService } from "@/services/dominios/departamento.service.js";
import { DominioController } from "@/controllers/dominios/dominios.controller.js";

export class DepartamentoController extends DominioController{
    constructor(){
        super(new DepartamentoService())
    }
}