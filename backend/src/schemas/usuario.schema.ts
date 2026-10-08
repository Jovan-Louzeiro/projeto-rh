import z, { ZodType } from "zod";

import { PermissaoUsuario } from "../../generated/prisma/enums.js";

import { CrudSchemas } from "./crud.schemas.js";

export class UsuariosSchemas extends CrudSchemas {

    public readonly loginSchema;
    public readonly adicionar;
    public readonly atualizar;

    constructor() {
        super();

        this.loginSchema = z.strictObject({
            email: this.stringSchema("E-mail", 1, 50),
            senha: this.stringSchema("Senha", 3),
        });

        const baseSchema = z.strictObject({
            nome: this.stringSchema("Nome", 1, 50),
            email: this.stringSchema("E-mail", 1, 50),
            senha: this.stringSchema("Senha", 3),
            permissao: z.enum(PermissaoUsuario),
            ativo: this.ativoSchema(),
        });

        this.adicionar = baseSchema;

        this.atualizar = baseSchema
            .partial()
            .refine(
                (data) => Object.keys(data).length > 0,
                {
                    message: "É necessário informar pelo menos um campo para atualizar",
                }
            );
    }
}

export type UsuarioCreate = z.infer<
    UsuariosSchemas["adicionar"]
>;

export type UsuarioUpdate = z.infer<
    UsuariosSchemas["atualizar"]
>;