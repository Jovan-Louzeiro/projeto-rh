import z from "zod";

import { DocumentosSchema } from "@/schemas/documentos/documentos.schemas.js";

export class CnhSchemas extends DocumentosSchema {

    public readonly adicionar;
    public readonly atualizar;
    public readonly schemaServidor;

    constructor() {
        super();

        const baseSchema = z.strictObject({
            numero: this.numeroSchema("Número da CNH", 11),
            categoria: this.stringSchema("Categoria", 1, 15),
            data_emissao: this.dataSchema("Data de emissão"),
            data_validade: this.dataSchema("Data de validade"),
            servidor_id: this.idExternoSchema("Id do Servidor")
        });

        this.adicionar = baseSchema;

        this.atualizar = baseSchema;

        this.schemaServidor = baseSchema.partial({servidor_id: true})
    }
}

export type CnhCreate = z.infer<
    CnhSchemas["adicionar"]
>

export type CnhUpdate = z.infer<
    CnhSchemas["atualizar"]
>