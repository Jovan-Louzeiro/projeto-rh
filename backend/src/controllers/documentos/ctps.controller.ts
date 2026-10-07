import { CtpsService } from "../../services/documentos/ctps.service.js";
import { DocumentosController } from "./documentos.controller.js";

export class CtpsController extends DocumentosController{

    constructor(){
        super(
            new CtpsService()
        )
    }

}