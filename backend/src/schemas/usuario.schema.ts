import z, { email, object, ZodType } from "zod";
import { PermissaoUsuario } from "../../generated/prisma/enums.js";
import { CrudSchemas } from "./crud.schemas.js";

export class UsuariosSchemas extends CrudSchemas {

    loginSchema: ZodType
    adicionar: ZodType
    atualizar: ZodType

    constructor() {
        super()

        this.loginSchema = z.object({
            email: z.string("O e-mail deve ser um String").min(1, "O e-mail deve ser preenchido").max(50, "O e-mail excedeu o limite de caracteres"),
            senha: z.string("A senha deve ser uma String").min(3, "A senha seve ter pelo menos 3 caracteres"),
        })

        this.adicionar = z.object({
            nome: z.string("O nome deve ser uma String").min(1, "O nome deve ser preenchido"),
            email: z.string("O e-mail deve ser um String").min(1, "O e-mail deve ser preenchido").max(50, "O e-mail excedeu o limite de caracteres"),
            senha: z.string("A senha deve ser uma String").min(3, "A senha seve ter pelo menos 3 caracteres"),
            permissao: z.enum(PermissaoUsuario),
            ativo: z.boolean("Ativo deve ser um valor boolean").optional()
        })

        this.atualizar = z.object({
            nome: z.string("O nome deve ser uma String").min(1, "O nome deve ser preenchido").optional(),
            email: z.string("O e-mail deve ser um String").min(1, "O e-mail deve ser preenchido").max(50, "O e-mail excedeu o limite de caracteres").optional(),
            senha: z.string("A senha deve ser uma String").min(3, "A senha seve ter pelo menos 3 caracteres").optional(),
            permissao: z.enum(PermissaoUsuario).optional(),
            ativo: z.boolean("Ativo deve ser um valor boolean").optional()
        }).refine(
            (data) => Object.keys(data).length > 0,
            {
                message: "É necessário informar pelo menos um campo para atualizar"
            }
        )

    }
}