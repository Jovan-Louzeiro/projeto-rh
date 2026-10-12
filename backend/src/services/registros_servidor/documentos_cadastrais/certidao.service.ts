import { prisma } from "@/lib/prisma.js";

import { DocumentosCadastraisServices } from "@/services/registros_servidor/documentos_cadastrais/documentosCadastrais.service.js";

import {
    CertidaoCreate,
    CertidaoUpdate
} from "@/schemas/registros_servidor/documentos_cadastrais/certidao.schemas.js";

export class CertidaoService extends DocumentosCadastraisServices<
    CertidaoCreate,
    CertidaoUpdate
> {

    constructor() {
        super(
            prisma.certidao,
            "Certidão",
        );
    }

    async atualizar(id: number, data: CertidaoUpdate) {

        if (data.nova_certidao) {
            data.termo = null;
            data.folha = null;
            data.livro = null;
        }

        return super.atualizar(id, data);
    }
}