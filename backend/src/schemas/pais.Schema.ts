import z from "zod";

export class PaisSchemas {

    public readonly adicionar
    public readonly atualizar

    constructor() {

        const baseSchema = z.strictObject({
            nome: z.string("O nome deve ser uma String").min(1, "O nome não pode ser vazia").max(100, `A descrição não pode conter mais de ${100} caracteres`),
            gentilico: z.string("O gentílico deve ser uma string").min(1, "O campo não pode estar vazio").max(100, "Máximo de caracteres: 100"),
            codigo_iso: z.string("O Codigo Iso deve ser uma string").min(1, "O campo não pode estar vazio").max(2, "O codigo tem no maximo 2 digitos"),
            ativo: z.boolean("O valor deve ser um boolean").optional()
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