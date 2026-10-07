import z from "zod";
import { DocumentosSchema } from "./documentos.schemas.js";

export class IdentidadeSchemas extends DocumentosSchema {

    public readonly adicionar;
    public readonly atualizar;

    constructor() {
        super();

        const baseSchema = z.strictObject({

            tipo: z.enum(["RG", "CIN"], "O tipo da identidade deve ser RG ou CIN"),

            numero: z
                .string("O número da identidade deve ser uma String")
                .transform(valor => valor.replace(/\D/g, ""))
                .refine(
                    valor => valor.length >= 1 && valor.length <= 30,
                    "O número da identidade deve conter entre 1 e 30 números"
                ),

            orgao_emissor: this.stringSchema("Órgão Emissor", 1, 30),

            uf_id: this.idExternoSchema("ID da UF da identidade"),

            data_emissao: this.dataSchema("Data de Emissão")

        });

        this.adicionar = baseSchema;

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