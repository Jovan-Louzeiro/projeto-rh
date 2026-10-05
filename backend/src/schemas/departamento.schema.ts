import { DominioSchemas } from "./dominos.schema.js";
import z from "zod";

export class DepartamentoSchemas extends DominioSchemas {

    constructor() {

        super(150);

        const schema = this.baseSchema.extend({
            inep: this.stringSchema("INEP", 1, 50)
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