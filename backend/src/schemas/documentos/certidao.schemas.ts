import z from "zod";

import { DocumentosSchema } from "./documentos.schemas.js";

export class CertidaoSchemas extends DocumentosSchema {

    public readonly adicionar;
    public readonly atualizar;

    constructor() {
        super();

        const baseSchema = z.strictObject({
            nova_certidao: this.booleanSchema("Nova Certidão"),

            matricula: this.numeroSchema("Matrícula", 32),

            tipo_certidao: z.enum(
                ["NASCIMENTO", "CASAMENTO"],
                "O tipo da certidão deve ser NASCIMENTO ou CASAMENTO"
            ),

            termo: this.numeroSchema("Termo", 5).nullish(),

            folha: this.numeroSchema("Folha", 5).nullish(),

            livro: this.numeroSchema("Livro", 5).nullish(),

            data_emissao: this.dataSchema("Data de emissão")
        });

        const validarCertidao = (
            data: z.infer<typeof baseSchema>,
            ctx: z.RefinementCtx
        ) => {

            // CERTIDÃO NOVA
            if (data.nova_certidao) {

                if (data.termo !== undefined) {
                    ctx.addIssue({
                        code: "custom",
                        path: ["termo"],
                        message:
                            "O termo não deve ser informado para certidão nova"
                    });
                }

                if (data.folha !== undefined) {
                    ctx.addIssue({
                        code: "custom",
                        path: ["folha"],
                        message:
                            "A folha não deve ser informada para certidão nova"
                    });
                }

                if (data.livro !== undefined) {
                    ctx.addIssue({
                        code: "custom",
                        path: ["livro"],
                        message:
                            "O livro não deve ser informado para certidão nova"
                    });
                }

                // CERTIDÃO ANTIGA
            } else {

                if (data.termo === undefined) {
                    ctx.addIssue({
                        code: "custom",
                        path: ["termo"],
                        message:
                            "O termo é obrigatório para certidão antiga"
                    });
                }

                if (data.folha === undefined) {
                    ctx.addIssue({
                        code: "custom",
                        path: ["folha"],
                        message:
                            "A folha é obrigatória para certidão antiga"
                    });
                }

                if (data.livro === undefined) {
                    ctx.addIssue({
                        code: "custom",
                        path: ["livro"],
                        message:
                            "O livro é obrigatório para certidão antiga"
                    });
                }
            }
        };

        /*
         * POST
         */
        this.adicionar = baseSchema.superRefine(validarCertidao);

        /*
         * PUT
         */
        this.atualizar = baseSchema.superRefine(validarCertidao);
    }


}

export type CertidaoUpdate = z.infer<
    CertidaoSchemas["atualizar"]
>;
export type CertidaoCreate = z.infer<
    CertidaoSchemas["adicionar"]
>;