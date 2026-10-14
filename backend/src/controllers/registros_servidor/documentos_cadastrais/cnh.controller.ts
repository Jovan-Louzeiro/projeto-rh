import { CnhService } from "@/services/registros_servidor/documentos_cadastrais/cnh.service.js";
import { DocumentosCadastraisController } from "@/controllers/registros_servidor/documentos_cadastrais/documentosCadastrais.controller.js";
import type { CnhCreate, CnhUpdate } from "@/schemas/registros_servidor/documentos_cadastrais/cnh.schemas.js";

export class CnhController extends DocumentosCadastraisController<
    CnhService<CnhCreate, CnhUpdate>
>{

    constructor(){
        super(
            new CnhService<CnhCreate, CnhUpdate>()
        )
    }

}