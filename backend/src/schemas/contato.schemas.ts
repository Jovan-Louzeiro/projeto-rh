import { TipoContato } from "#/generated/prisma/enums.js";
import { CrudSchemas } from "@/schemas/crud.schemas.js";
import z from "zod";

export class ContatoSchema extends CrudSchemas {
    
    public readonly adicionar;
    public readonly atualizar;

    constructor() {

        super()


        const camposBase = {
            principal: this.booleanSchema("Principal", true),
            ativo: this.booleanSchema("Ativo", true),
            servidor_id: this.idExternoSchema("Id do Servidor").optional().nullable()
        };

        const telefoneSchema = z
            .string()
            .trim()
            .regex(/^\d{10,11}$/, {
                error: "Telefone deve conter DDD e 10 ou 11 dígitos.",
            });

        const emailSchema = z.email({
            error: "Informe um endereço de e-mail válido.",
        });

        const contatoSchema = z.discriminatedUnion("tipo_contato", [
            z.strictObject({
                ...camposBase,
                tipo_contato: z.literal(TipoContato.TELEFONE_MOVEL),
                contato: telefoneSchema.length(11, {
                    error: "Celular deve conter 11 dígitos, incluindo o DDD.",
                }),
            }),

            z.strictObject({
                ...camposBase,
                tipo_contato: z.literal(TipoContato.TELEFONE_FIXO),
                contato: telefoneSchema.length(10, {
                    error: "Telefone fixo deve conter 10 dígitos, incluindo o DDD.",
                }),
            }),

            z.strictObject({
                ...camposBase,
                tipo_contato: z.literal(TipoContato.EMAIL),
                contato: emailSchema,
            }),

        ]);

        this.adicionar = contatoSchema;
        this.atualizar = contatoSchema;
    }
}

export type ContatoCreate = z.infer<
    ContatoSchema["adicionar"]
>

export type ContatoUpdate = z.infer<
    ContatoSchema["atualizar"]
>
