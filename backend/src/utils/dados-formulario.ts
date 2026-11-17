import type { Request } from "express";
import { AppError } from "@/errors/app.errors.js";

export function obterDadosFormulario(req: Request): unknown {
    const dados = req.body?.dados;
    if (typeof dados !== "string") return req.body;

    let valor: unknown;
    try {
        valor = JSON.parse(dados);
    } catch (error) {
        if (error instanceof SyntaxError) {
            throw new AppError(400, "O campo dados deve conter um JSON válido.");
        }
        throw error;
    }

    if (!valor || typeof valor !== "object" || Array.isArray(valor)) {
        throw new AppError(400, "O campo dados deve conter um objeto JSON.");
    }
    return valor;
}
