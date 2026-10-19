import z from "zod";

import { DocumentosSchema } from "@/schemas/documentos/documentos.schemas.js";

export class TituloEleitorSchemas extends DocumentosSchema {

    public readonly adicionar;

    public readonly atualizar;

    public readonly schemaServidor;


    constructor() {

        super();

        const baseSchema = z.strictObject({

            numero: this.numeroSchema("Número do título de eleitor", 12),

            zona: this.numeroSchema("Zona eleitoral", 4),

            secao: this.numeroSchema("Seção eleitoral", 4),

            servidor_id: z.number()

        });

        this.adicionar = baseSchema;

        this.atualizar = baseSchema;

        this.schemaServidor = baseSchema.partial({servidor_id: true})
    }
}

export type TituloEleitorCreate = z.infer<
    TituloEleitorSchemas["adicionar"]
>

export type TituloEleitorUpdate = z.infer<
    TituloEleitorSchemas["atualizar"]
>