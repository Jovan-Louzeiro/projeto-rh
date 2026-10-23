import { isValid, parse } from "date-fns";
import z, { ZodAny, ZodObject, ZodPipe, ZodType } from "zod";
import { validarCpf } from "@/utils/validators.js";
import type { ParamsDictionary } from "express-serve-static-core";
export class CrudSchemas {

    public adicionar: ZodType;
    public atualizar: ZodType;

    constructor(params?: ZodType) {

        this.adicionar = z.object()

        this.atualizar = z.object()
        
    }

    parseParams(parametros: ParamsDictionary) {
        return z.record(
            z.string(),
            z.coerce
                .number()
                .int("O ID deve ser um número inteiro")
                .positive("O ID deve ser positivo")
        ).parse(parametros);
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
        return z.preprocess(
            valor => {
                if (valor === "true") return true
                if (valor === "false") return false
                return valor
            },
            z.boolean("Ativo deve ser um valor boolean")
            .optional()
        )
    }

    idExternoSchema(nome: string) {
        return z.coerce
            .number(`O id do ${nome} deve ser informado`)
            .int(`O id do ${nome} deve ser um número inteiro`)
            .positive(`O id do ${nome} deve ser positivo`);
    }

    stringSchema(
        nome: string,
        minimo?: number,
        maximo?: number
    ): z.ZodString;

    stringSchema(
        nome: string,
        minimo: number | undefined,
        maximo: number | undefined,
        opcional: true
    ): z.ZodOptional<z.ZodString>;

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

    // Transforma remove as pontuações da string
    numeroSchema(nome: string, quantidade?: number, maximo?: number) {
        let schema = z
            .string(`O ${nome} deve ser em formato de string`)
            .transform(valor => valor.replace(/\D/g, ""))

        // Obriga o dado a ter uma quantidade exata de caracteres
        if (quantidade !== undefined) {
            schema = schema.refine(
                valor => valor.length === quantidade,
                {
                    message: `O ${nome} deve conter exatamente ${quantidade} números`
                }
            )
        }

        // Indica o maximo de caracteres que a string pode ter
        if (maximo !== undefined) {
            schema = schema.refine(valor => valor.length <= maximo && valor.length > 0, {
                message: `O ${nome} deve conter entre 0 e ${maximo} caracteres`
            })
        }

        return schema
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

    // Obriga o schema a ter o campo servidor_id ao schema
    adicionarSevidorId<T extends z.ZodRawShape>(
        schema: z.ZodObject<T>
    ) {
        return schema.extend({
            servidor_id: this.idExternoSchema("Servidor Id").nonoptional()
        });
    }

    // Transforma o schema para PATCH
    transformarPatch<T extends z.ZodRawShape>(
        schema: z.ZodObject<T>
    ) {
        return schema
            .partial()
            .refine(
                (data) => Object.keys(data).length > 0,
                {
                    message: "É necessário informar pelo menos um campo para atualizar",
                }
            );
    }
}