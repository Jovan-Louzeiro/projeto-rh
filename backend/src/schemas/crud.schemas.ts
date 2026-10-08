import { isValid, parse } from "date-fns";
import z, { ZodType } from "zod";
import { validarCpf } from "../utils/validators.js";

export class CrudSchemas {
    public params: ZodType;

    constructor(params?: ZodType) {
        this.params = params ?? this.getParams();
    }

    getParams(): z.ZodType {
        return z.strictObject({
            id: z.coerce
                .number("Parâmetro inválido")
                .int("O ID deve ser um número inteiro")
                .positive("O ID deve ser positivo")
        });
    }

    ativoSchema() {
        return z
            .boolean("Ativo deve ser um valor boolean")
            .optional()
    }

    idExternoSchema(nome: string) {
        return z.coerce
            .number(`O id do ${nome} deve ser informado`)
            .int(`O id do ${nome} deve ser um número inteiro`)
            .positive(`O id do ${nome} deve ser positivo`);
    }

    stringSchema(nome: string, minimo?: number, maximo?: number, opcional = false) {

        let schema = z
            .string(`O ${nome} deve ser uma String`)

        if (minimo !== undefined) {
            schema = schema.min(minimo, `O ${nome} não pode estar vazio`)
        }

        if (maximo !== undefined) {
            schema = schema.max(maximo, `O ${nome} não deve ter mais de ${maximo} caracteres`)
        }

        if (opcional === true) {
            return schema.optional()
        }

        return schema

    }

    dataSchema(nome: string) {

        return z.string(
            `A ${nome} deve ser uma string`
        )
            .regex(
                /^\d{4}-\d{2}-\d{2}$/,
                `A ${nome} deve estar no formato AAAA-MM-DD`
            )
            .refine((val) => {
                return isValid(
                    parse(val, "yyyy-MM-dd", new Date())
                );
            }, {
                message: "Data inválida"
            })
            .transform((val) =>
                parse(val, "yyyy-MM-dd", new Date())
            );
    }

    numeroSchema(nome: string, quantidade: number) {
        return z
            .string(`O ${nome} deve ser em formato de string`)
            .transform(valor => valor.replace(/\D/g, ""))
            .refine(
                valor => new RegExp(`^\\d{${quantidade}}$`).test(valor),
                {
                    message: `O ${nome} deve conter exatamente ${quantidade} números`
                }
            )
    }

    booleanSchema(nome: string, opcional = false) {
        const schema = z.boolean(
            `${nome} deve ser um valor boolean`
        )

        return opcional ? schema.optional() : schema
    }

    cpfSchema(nome: string) {
        return z
            .string(`O ${nome} deve ser uma String`)
            .transform(cpf => cpf.replace(/\D/g, ""))
            .refine(cpf => /^\d{11}$/.test(cpf), {
                message: `O ${nome} deve conter exatamente 11 números`
            })
            .refine(validarCpf, {
                message: `O ${nome} informado é inválido`
            })
    }
}