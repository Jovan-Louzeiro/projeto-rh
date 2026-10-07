import { CnhService } from "../../services/documentos/cnh.service.js";
import { DocumentosController } from "./documentos.controller.js";

export class CnhController extends DocumentosController{

    constructor(){
        super(
            new CnhService()
        )
    }

}