import type { Request, Response, NextFunction } from "express";

import {
    EmailOuSenhaInvalidos,
    NaoAutorizado,
    TokenInvalidoOuExpirado,
    TokenNaoFornecido,
    UsuarioInativo
} from "../errors/auth.erros.js";

import { tratarErroPrisma } from "../errors/prisma.errors.js";
import { AppError } from "../errors/app.errors.js";

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