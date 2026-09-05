import type { Request, Response, NextFunction } from "express";

import {
    RegistroEmUso,
    RegistroJaExistenteError,
    RegistroNaoEncontradoError
} from "../errors/dominios.errors.js";

export function errorHandler(
    error: unknown,
    req: Request,
    res: Response,
    next: NextFunction
) {

    console.error(error);

    if (error instanceof RegistroJaExistenteError) {
        return res.status(409).json({
            erro: error.name,
            mensagem: error.message
        });
    }

    if (error instanceof RegistroNaoEncontradoError) {
        return res.status(404).json({
            erro: error.name,
            mensagem: error.message
        });
    }

    if (error instanceof RegistroEmUso) {
        return res.status(409).json({
            erro: error.name,
            mensagem: error.message
        });
    }

    return res.status(500).json({
        erro: "ERRO_INTERNO",
        mensagem: "Erro interno do servidor."
    });
}