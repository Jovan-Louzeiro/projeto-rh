import z, { email } from "zod";

export const loginSchema = z.object({
    email: z.string("O e-mail deve ser um String").min(1, "O e-mail deve ser preenchido").max(50, "O e-mail excedeu o limite de caracteres"),
    senha: z.string("A senha deve ser uma String").min(3, "A senha seve ter pelo menos 3 caracteres"),
})

export const cadastroSchema = z.object({
    email: z.string("O e-mail deve ser um String").min(1, "O e-mail deve ser preenchido").max(50, "O e-mail excedeu o limite de caracteres"),
    senha: z.string("A senha deve ser uma String").min(3, "A senha seve ter pelo menos 3 caracteres"),
    permissao: z.enum(["ADMIN", "RH"], "Permissões disponiveis: RH ou ADMIN"),
    ativo: z.boolean("Ativo deve ser um valor boolean").optional()
})