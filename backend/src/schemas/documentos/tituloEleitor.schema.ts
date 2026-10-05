import z from "zod";

import { CrudSchemas } from "../crud.schemas.js";

export class TituloEleitorSchemas extends CrudSchemas {

    public readonly adicionar;
    public readonly atualizar;

    constructor() {

        super();

        const baseSchema = z.strictObject({

            numero: this.numeroSchema("Número do título de eleitor", 12),

            zona: this.numeroSchema("Zona eleitoral", 4),

            secao: this.numeroSchema("Seção eleitoral", 4),

            ativo: this.ativoSchema()

        });

        this.adicionar = baseSchema;

        this.atualizar = baseSchema
            .partial()
            .refine(
                data => Object.keys(data).length > 0,
                {
                    message: "É necessário informar pelo menos um campo para atualizar"
                }
            );
    }
}