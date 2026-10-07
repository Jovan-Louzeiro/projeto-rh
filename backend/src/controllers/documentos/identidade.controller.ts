import { IdentidadeService } from "../../services/documentos/identidade.service.js";
import { DocumentosController } from "./documentos.controller.js";

export class IdentidadeController extends DocumentosController{

    constructor(){
        super(
            new IdentidadeService()
        )
    }

}