import type { Request, Response, NextFunction } from "express";

import {
    RegistroEmUso,
    RegistroJaExistenteError,
    RegistroNaoEncontradoError
} from "../errors/dominios.errors.js";
import { EmailOuSenhaInvalidos, TokenInvalidoOuExpirado, TokenNaoFornecido, UsuarioInativo } from "../errors/auth.erros.js";

export function errorHandler(
    error: unknown,
    req: Request,
    res: Response,
    next: NextFunction
) {

    console.error(error);

    if (error instanceof RegistroJaExistenteError) {
        return res.status(error.status).json({
            erro: error.name,
            mensagem: error.message
        });
    }

    if (error instanceof RegistroNaoEncontradoError) {
        return res.status(error.status).json({
            erro: error.name,
            mensagem: error.message
        });
    }

    if (error instanceof RegistroEmUso) {
        return res.status(error.status).json({
            erro: error.name,
            mensagem: error.message
        });
    }

    if (error instanceof EmailOuSenhaInvalidos){
        return res.status(error.status).json({
            erro: error.name,
            mensagem: error.message
        });
    }

    if (error instanceof TokenNaoFornecido){
        return res.status(error.status).json({
            erro: error.name,
            mensagem: error.message
        });
    }

    if (error instanceof TokenInvalidoOuExpirado){
        return res.status(error.status).json({
            erro: error.name,
            mensagem: error.message
        });
    }

    if (error instanceof UsuarioInativo){
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