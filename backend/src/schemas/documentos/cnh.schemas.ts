import z from "zod";

import { DocumentosSchema } from "./documentos.schemas.js";

export class CnhSchemas extends DocumentosSchema {

    public readonly adicionar;
    public readonly atualizar;

    constructor() {
        super();

        const baseSchema = z.strictObject({
            numero: this.numeroSchema("Número da CNH", 11),
            categoria: this.stringSchema("Categoria", 1, 15),
            data_emissao: this.dataSchema("Data de emissão"),
            data_validade: this.dataSchema("Data de validade"),
        });

        this.adicionar = baseSchema;

        this.atualizar = baseSchema;
    }
}