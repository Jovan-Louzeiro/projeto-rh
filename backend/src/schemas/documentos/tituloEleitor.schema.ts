import z from "zod";

import { DocumentosSchema } from "@/schemas/documentos/documentos.schemas.js";

export class TituloEleitorSchemas extends DocumentosSchema {

    public readonly adicionar;

    public readonly atualizar;

    constructor() {

        super();

        const baseSchema = z.strictObject({

            numero: this.numeroSchema("Número do título de eleitor", 12),

            zona: this.numeroSchema("Zona eleitoral", 4),

            secao: this.numeroSchema("Seção eleitoral", 4),

            servidor_id: this.idExternoSchema("Id do Servidor")

        });

        this.adicionar = baseSchema;

        this.atualizar = baseSchema;
    }
}

export type TituloEleitorCreate = z.infer<
    TituloEleitorSchemas["adicionar"]
>

export type TituloEleitorUpdate = z.infer<
    TituloEleitorSchemas["atualizar"]
>