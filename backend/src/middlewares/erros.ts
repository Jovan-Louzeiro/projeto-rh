import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

import { tratarErroPrisma } from "@/errors/prisma.errors.js";
import { AppError } from "@/errors/app.errors.js";

function tratarErroZod(error: ZodError) {
    const detalhes = error.issues.map((issue) => {
        const detalhe: {
            campo: string;
            mensagem: string;
            codigo: string;
            opcoes?: string[];
            campos?: string[];
        } = {
            campo: issue.path.join(".") || "params",
            mensagem: issue.message,
            codigo: issue.code
        };

        if (issue.code === "invalid_value") {
            detalhe.mensagem =
                "Valor inválido. Escolha uma das opções permitidas.";

            detalhe.opcoes = issue.values.map(String);
        }

        if (issue.code === "unrecognized_keys") {
            detalhe.mensagem = "O campo enviado não é reconhecido.";
            detalhe.campos = issue.keys;
        }

        return detalhe;
    });

    return {
        erro: "DADOS_INVALIDOS",
        mensagem: "Os dados enviados são inválidos.",
        detalhes
    };
}

export function errorHandler(
    error: unknown,
    req: Request,
    res: Response,
    next: NextFunction
) {
    console.error(error);

    if (error instanceof ZodError) {
        return res.status(422).json(tratarErroZod(error));
    }

    let erroFinal = error;

    try {
        tratarErroPrisma(error);
    } catch (erroTratado) {
        erroFinal = erroTratado;
    }

    if (erroFinal instanceof AppError) {
        return res.status(erroFinal.status).json({
            erro: erroFinal.name,
            mensagem: erroFinal.message
        });
    }

    return res.status(500).json({
        erro: "ERRO_INTERNO",
        mensagem: "Erro interno do servidor."
    });
}