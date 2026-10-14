import type { DocumentosCadastraisServices } from "@/services/registros_servidor/documentos_cadastrais/documentosCadastrais.service.js";
import { RegistrosServidorController } from "@/controllers/registros_servidor/registrosServidor.controller.js";

export class DocumentosCadastraisController<
    TService extends DocumentosCadastraisServices<any, any> =
        DocumentosCadastraisServices<any, any>
> extends RegistrosServidorController<TService> {

    constructor(documentoService: TService) {

        super(
            documentoService,
            {
                procurar: "idServidor",
                atualizar: "idServidor",
                deletar: "idServidor",
            }
        )

    }

}