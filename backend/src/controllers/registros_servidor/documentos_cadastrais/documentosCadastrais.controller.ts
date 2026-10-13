import { DocumentosCadastraisServices } from "@/services/registros_servidor/documentos_cadastrais/documentosCadastrais.service.js";
import { RegistrosServidorController } from "@/controllers/registros_servidor/registrosServidor.controller.js";

export class DocumentosCadastraisController extends RegistrosServidorController {

    constructor(DocumentoService: DocumentosCadastraisServices<any, any>) {

        super(
            DocumentoService,
            {
                procurar: "idServidor",
                atualizar: "idServidor",
                deletar: "idServidor",
            }
        )

    }

}