import z from "zod";

import { DocumentosSchema } from "./documentos.schemas.js";

export class CtpsSchemas extends DocumentosSchema {

    public readonly adicionar;

    public readonly atualizar;

    constructor() {

        super();

        const baseSchema = z.strictObject({

            tipo_ctps: z.enum(
                ["ANTIGO", "NOVO"],
                "O tipo da CTPS deve ser ANTIGO ou NOVO"
            ),

            numero: this.numeroSchema("Número da CTPS", 8).optional().nullish(),

            serie: this.numeroSchema("Série da CTPS", 5).optional().nullish(),

            uf_ctps_id: this.idExternoSchema("UF").optional().nullish(),

            data_emissao: this.dataSchema("Data de emissão")

        });

        const validarCtps = (
            data: z.infer<typeof baseSchema>,
            ctx: z.RefinementCtx
        ) => {

            if (data.tipo_ctps === "ANTIGO") {

                if (data.numero === undefined) {
                    ctx.addIssue({
                        code: "custom",
                        path: ["numero"],
                        message:
                            "O número é obrigatório para CTPS antiga"
                    });
                }

                if (data.serie === undefined) {
                    ctx.addIssue({
                        code: "custom",
                        path: ["serie"],
                        message:
                            "A série é obrigatória para CTPS antiga"
                    });
                }

                if (data.uf_ctps_id === undefined) {
                    ctx.addIssue({
                        code: "custom",
                        path: ["uf_ctps_id"],
                        message:
                            "A UF é obrigatória para CTPS antiga"
                    });
                }

            } else {

                if (data.numero !== undefined) {
                    ctx.addIssue({
                        code: "custom",
                        path: ["numero"],
                        message:
                            "O número não deve ser informado para CTPS nova"
                    });
                }

                if (data.serie !== undefined) {
                    ctx.addIssue({
                        code: "custom",
                        path: ["serie"],
                        message:
                            "A série não deve ser informada para CTPS nova"
                    });
                }

                if (data.uf_ctps_id !== undefined) {
                    ctx.addIssue({
                        code: "custom",
                        path: ["uf_ctps_id"],
                        message:
                            "A UF não deve ser informada para CTPS nova"
                    });
                }
            }
        };

        this.adicionar = baseSchema.superRefine(validarCtps);

        this.atualizar = baseSchema.superRefine(validarCtps);
    }
}

export type CtpsUpdate = z.infer<
    CtpsSchemas["atualizar"]
>;
export type CtpsCreate = z.infer<
    CtpsSchemas["adicionar"]
>;