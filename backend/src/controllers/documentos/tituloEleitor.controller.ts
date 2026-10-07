import { TituloEleitorService } from "../../services/documentos/tituloEleitor.service.js";
import { DocumentosController } from "./documentos.controller.js";

export class TituloEleitorController extends DocumentosController{

    constructor(){
        super(
            new TituloEleitorService()
        )
    }

}