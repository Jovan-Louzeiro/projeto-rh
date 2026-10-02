import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

export function validate(
    schema: ZodSchema,
    tipoValidacao: "body" | "params" | "query"
) {
    return (req: Request, res: Response, next: NextFunction) => {

        const dados = req[tipoValidacao];

        const resultado = schema.safeParse(dados);

        if (!resultado.success) {
            return res.status(422).json({
                erro: "DADOS_INVALIDOS",
                detalhes: resultado.error.issues
            });
        }

        req[tipoValidacao] = resultado.data;

        next();
    };
}