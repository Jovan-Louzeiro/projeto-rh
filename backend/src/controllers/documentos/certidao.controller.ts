import { CertidaoService } from "../../services/documentos/certidao.service.js";
import { DocumentosController } from "./documentos.controller.js";

export class CertidaoController extends DocumentosController{

    constructor(){
        super(
            new CertidaoService()
        )
    }

}