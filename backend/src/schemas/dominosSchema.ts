import z from "zod";


export class DominioSchemas {
    public readonly adicionar
    public readonly atualizar

    constructor(private readonly limiteDescricao: number) {
        const baseSchema = z.object({
            descricao: z
                .string("A descrição deve ser uma String")
                .min(1, "A descrição não pode ser vazia")
                .max(
                    limiteDescricao,
                    `A descrição não pode conter mais de ${limiteDescricao} caracteres`
                ),

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