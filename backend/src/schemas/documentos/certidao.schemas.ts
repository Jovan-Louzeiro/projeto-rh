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

            tipo_certidao: z.enum(["NASCIMENTO", "CASAMENTO"], "O tipo da certidão deve ser NASCIMENTO ou CASAMENTO"),

            termo: this.numeroSchema("Termo", 5).optional(),

            folha: this.numeroSchema("Folha", 5).optional(),

            livro: this.numeroSchema("Livro", 5).optional(),

            data_emissao: this.dataSchema("data de emissão")
        });

        this.adicionar = baseSchema.superRefine((data, ctx) => {

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