import z from "zod";
import { CrudSchemas } from "./crud.schemas.js";

export class MunicipioSchema extends CrudSchemas {
    
    public readonly adicionar;
    public readonly atualizar;

    constructor() {
        super()

        const baseSchema = z.strictObject({
            nome: z
                .string("O nome deve ser uma String")
                .min(1, "O nome não pode ser vazia")
                .max(
                    100,
                    `O nome não pode conter mais de ${100} caracteres`
                ),

            estado_id: z
            .int("O id do pais deve ser informado")
            .positive("O id deve ser positivo"),

            ativo: z
                .boolean("O valor deve ser um boolean")
                .optional()
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