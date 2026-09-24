import { dominiosConfig } from "../config/dominios.config.js";
import { criarDominio } from "./dominio.factory.js";
import type { DominiosRoutes } from "../routes/dominios/dominios.routes.js";

export const dominios: Record<string, DominiosRoutes> =
    Object.fromEntries(
        Object.entries(dominiosConfig).map(([chave, config]) => [
            chave,
            criarDominio(config)
        ])
    );