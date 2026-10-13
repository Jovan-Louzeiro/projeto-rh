import { CertidaoService } from "@/services/registros_servidor/documentos_cadastrais/certidao.service.js";
import { DocumentosCadastraisController } from "@/controllers/registros_servidor/documentos_cadastrais/documentosCadastrais.controller.js";

export class CertidaoController extends DocumentosCadastraisController{

    constructor(){
        super(
            new CertidaoService()
        )
    }

}