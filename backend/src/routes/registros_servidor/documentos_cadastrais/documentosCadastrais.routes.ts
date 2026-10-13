import { Autorizacoes, autorizacoesPadrao, DocumentosSchemas } from "@/types/crud.types.js";
import { DocumentosCadastraisController } from "@/controllers/registros_servidor/documentos_cadastrais/documentosCadastrais.controller.js";
import { RegistrosServidorRoute } from "@/routes/registros_servidor/registros_servidor.routes.js";

export class DocumentosCadastraisRoute extends RegistrosServidorRoute{

    constructor(
        protected controller: DocumentosCadastraisController,
        schema: DocumentosSchemas,
        autorizacoes?: Partial<Autorizacoes>
    ) {
        super(
            controller,
            schema,
            autorizacoes
        )
    }

}