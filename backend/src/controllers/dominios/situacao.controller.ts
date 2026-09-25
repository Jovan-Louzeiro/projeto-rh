import { SituacaoService } from "../../services/dominios/situacao.service.js";
import { DominioController } from "./dominios.controller.js";

export class SituacaoController extends DominioController{
    constructor(){
        super(new SituacaoService())
    }
}