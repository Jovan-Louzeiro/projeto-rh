import z from "zod";

export const adicionarSexoSchema = z.object({
    descricao: z.string("A descrição deve ser uma Strng").min(1, "A descrição não pode ser vazia").max(10, "A descrição não pode conter mais de 10 caracteres")
})

export const atualizarSexoSchema = z.object({
    descricao: z.string("A descrição deve ser uma Strng").min(1, "A descrição não pode ser vazia").max(10, "A descrição não pode conter mais de 10 caracteres")
})