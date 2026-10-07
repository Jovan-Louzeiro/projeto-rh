import z from "zod";
import { DocumentosSchema } from "./documentos.schemas.js";

export class CtpsSchemas extends DocumentosSchema {

    public readonly adicionar;
    public readonly atualizar;

    constructor() {

        super();

        const baseSchema = z.strictObject({

            tipo_ctps: z.enum(["ANTIGO", "NOVO"], "O tipo da CTPS deve ser ANTIGO ou NOVO"),

            numero: this.numeroSchema("Número da CTPS", 15).optional(),

            serie: this.numeroSchema("Série da CTPS", 5).optional(),

            uf_ctps_id: this.idExternoSchema("UF").optional(),

            data_emissao: this.dataSchema("data de emissão")

        });

        this.adicionar = baseSchema.superRefine((data, ctx) => {

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
        });

        this.atualizar = baseSchema
            .partial()
            .refine(
                data => Object.keys(data).length > 0,
                {
                    message:
                        "É necessário informar pelo menos um campo para atualizar"
                }
            );
    }
}