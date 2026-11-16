import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

export function validate(
    schema: ZodSchema,
    tipoValidacao: "body" | "params" | "query"
) {
    return (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        const dados = req[tipoValidacao];

        const resultado = schema.safeParse(dados);

        if (!resultado.success) {
            const detalhes = resultado.error.issues.map((issue) => ({
                campo: issue.path.join(".") || tipoValidacao,
                mensagem: issue.message,
                codigo: issue.code
            }));

            return res.status(422).json({
                erro: "DADOS_INVALIDOS",
                mensagem: "Os dados enviados são inválidos.",
                detalhes
            });
        }

        req[tipoValidacao] = resultado.data;

        return next();
    };
}