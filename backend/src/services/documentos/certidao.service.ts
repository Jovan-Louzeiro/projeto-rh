import { prisma } from "../../lib/prisma.js";

import { DocumentosServices } from "./documentos.service.js";

import {
    CertidaoCreate,
    CertidaoUpdate
} from "../../schemas/documentos/certidao.schemas.js";

export class CertidaoService extends DocumentosServices<
    CertidaoCreate,
    CertidaoUpdate
> {

    constructor() {
        super(
            prisma.certidao,
            "Certidão",
            "servidor_id"
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