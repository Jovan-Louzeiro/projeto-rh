import type { Request, Response, NextFunction } from "express";

import { tratarErroPrisma } from "@/errors/prisma.errors.js";
import { AppError } from "@/errors/app.errors.js";
import { ZodError } from "zod";

export function errorHandler(
    error: unknown,
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        console.log(error);
        tratarErroPrisma(error);
    } catch (error) {

        if (error instanceof ZodError) {
            const detalhes = error.issues.map((issue) => ({
                campo: issue.path.join(".") || "params",
                mensagem: issue.message,
                codigo: issue.code
            }));

            return res.status(422).json({
                erro: "DADOS_INVALIDOS",
                mensagem: "Os dados enviados são inválidos.",
                detalhes
            });
        }

        if (error instanceof AppError) {
            return res.status(error.status).json({
                erro: error.name,
                mensagem: error.message
            });


        }

        return res.status(500).json({
            erro: "ERRO_INTERNO",
            mensagem: "Erro interno do servidor."
        });
    }
}