import z from "zod";
import { DominioSchemas } from "@/schemas/dominios/dominos.schema.js";

export class DepartamentoSchemas extends DominioSchemas {

    constructor() {

        super(150);

        const schema = this.baseSchema.extend({
            inep: this.stringSchema("INEP", 1, 50).optional()
        });

        this.adicionar = schema;

        this.atualizar = schema
            .partial()
            .refine(
                data => Object.keys(data).length > 0,
                {
                    message: "É necessário informar pelo menos um campo para atualizar"
                }
            );
    }
}

export type DepartamentoCreate = z.infer<
    DepartamentoSchemas["adicionar"]
>

export type DepartamentoUpdate = z.infer<
    DepartamentoSchemas["atualizar"]
>