import z from "zod";

import { DocumentosSchema } from "./documentos.schemas.js";

export class IdentidadeSchemas extends DocumentosSchema {

    public readonly adicionar;

    public readonly atualizar;

    constructor() {

        super();

        const baseSchema = z.strictObject({

            tipo_identidade: z.enum(
                ["RG", "CIN"],
                "O tipo da identidade deve ser RG ou CIN"
            ),

            numero: z
                .string("O número da identidade deve ser uma String")
                .transform(valor => valor.replace(/\D/g, ""))
                .refine(
                    valor => valor.length >= 1 && valor.length <= 30,
                    "O número da identidade deve conter entre 1 e 30 números"
                )
                .optional().nullish(),

            orgao_emissor: this.stringSchema(
                "Órgão Emissor",
                1,
                30
            ),

            rg_uf_id: this.idExternoSchema(
                "ID da UF da identidade"
            ),

            rg_data_emissao: this.dataSchema(
                "Data de Emissão"
            )

        });

        const validarIdentidade = (
            data: z.infer<typeof baseSchema>,
            ctx: z.RefinementCtx
        ) => {

            if (data.tipo_identidade === "RG") {

                if (data.numero === undefined) {
                    ctx.addIssue({
                        code: "custom",
                        path: ["numero"],
                        message:
                            "O número é obrigatório para RG"
                    });
                }

            } else {

                if (data.numero !== undefined) {
                    ctx.addIssue({
                        code: "custom",
                        path: ["numero"],
                        message:
                            "O número não deve ser informado para CIN, pois o CPF é seu identificador"
                    });
                }
            }
        };

        this.adicionar = baseSchema.superRefine(validarIdentidade);

        this.atualizar = baseSchema.superRefine(validarIdentidade);
    }
}

export type IdentidadeCreate = z.infer<
    IdentidadeSchemas["adicionar"]
>

export type IdentidadeUpdate = z.infer<
    IdentidadeSchemas["atualizar"]
>