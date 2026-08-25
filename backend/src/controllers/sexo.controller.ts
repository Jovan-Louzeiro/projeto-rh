import type { Request, Response } from "express";
import { listarSexos } from "../services/sexo.services.js";

export async function listar(req: Request, res: Response) {
    try{
        const sexos = await listarSexos();

        return res.json(sexos);
    } catch (error){
        console.error(error);

        return res.status(500).json({
            erro: "Erro ao buscar sexos"
        })
    }
}