import { prisma } from "@/lib/prisma.js";

import { DocumentosServices } from "@/services/documentos/documentos.service.js";

import type {
    CertidaoCreate,
    CertidaoUpdate
} from "@/schemas/documentos/certidao.schemas.js";

export class CertidaoService extends DocumentosServices<CertidaoCreate, CertidaoUpdate> {

    constructor() {
        super(
            prisma.certidao,
            "Certidão",
        );
    }

    async atualizar(usuario: string, id: number,  data: CertidaoUpdate) {

        if (data.nova_certidao) {
            data.termo = null;
            data.folha = null;
            data.livro = null;
        }

        return super.atualizar(usuario, id, data);
    }
}