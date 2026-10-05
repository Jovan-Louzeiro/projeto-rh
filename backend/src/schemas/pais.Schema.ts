import z from "zod";
import { CrudSchemas } from "./crud.schemas.js";

export class PaisSchemas extends CrudSchemas{

    public readonly adicionar
    public readonly atualizar

    constructor() {

        super()

        const baseSchema = z.strictObject({
            nome: this.stringSchema("Nome", 1, 100),
            gentilico: this.stringSchema("Gentílico", 1, 100),
            codigo_iso: this.stringSchema("Código Iso", 1, 2),
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