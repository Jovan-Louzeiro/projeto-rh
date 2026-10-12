import z from "zod";

import { DocumentosCadastraisSchema } from "@/schemas/registros_servidor/documentos_cadastrais/documentosCadastrais.schemas.js";

export class TituloEleitorSchemas extends DocumentosCadastraisSchema {

    public readonly adicionar;

    public readonly atualizar;

    constructor() {

        super();

        const baseSchema = z.strictObject({

            numero: this.numeroSchema("Número do título de eleitor", 12),

            zona: this.numeroSchema("Zona eleitoral", 4),

            secao: this.numeroSchema("Seção eleitoral", 4)

        });

        this.adicionar = baseSchema;

        this.atualizar = baseSchema;
    }
}