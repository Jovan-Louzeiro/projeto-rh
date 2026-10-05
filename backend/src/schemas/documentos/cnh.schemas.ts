import z from "zod";
import { CrudSchemas } from "../crud.schemas.js";

export class CnhSchemas extends CrudSchemas {

    public readonly adicionar;
    public readonly atualizar;

    constructor() {

        super();

        const baseSchema = z.strictObject({

            numero: this.numeroSchema("Número da CNH", 11),

            categoria: this.stringSchema("Categoria", 1, 15),

            data_emissao: this.dataSchema("data de emissão"),

            data_validade: this.dataSchema("data de validade"),

            ativo: this.ativoSchema()

        });

        this.adicionar = baseSchema;

        this.atualizar = baseSchema
            .partial()
            .refine(
                data => Object.keys(data).length > 0,
                {
                    message:
                        "É necessário informar pelo menos um campo para atualizar"
                }
            );
    }
}