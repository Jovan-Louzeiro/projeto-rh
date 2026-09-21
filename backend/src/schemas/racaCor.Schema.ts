import z from "zod";

export const adicionarRacaCorSchema = z.object({
    descricao: z.string("A descrição deve ser uma Strng").min(1, "A descrição não pode ser vazia").max(10, "A descrição não pode conter mais de 10 caracteres"),
    ativo: z.boolean("O valor deve ser um boolean").optional()
})

export const atualizarRacaCorSchema = z.object({
    descricao: z.string("A descrição deve ser uma Strng").min(1, "A descrição não pode ser vazia").max(10, "A descrição não pode conter mais de 10 caracteres"). optional(),
    ativo: z.boolean("O valor deve ser um boolean").optional()
}).refine(
    (data) => Object.keys(data).length > 0,
    {
        message: "É necessário informar pelo menos um campo para atualizar"
    }
)