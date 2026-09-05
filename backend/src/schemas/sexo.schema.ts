import z from "zod";

export const sexoSchema = z.object({
    descricao: z.string("A descrição deve ser uma Strng").min(1, "A descrição não pode ser vazia").max(10, "A descrição não pode conter mais de 10 caracteres"),
    ativo: z.boolean("O valor deve ser um boolean").optional()
})