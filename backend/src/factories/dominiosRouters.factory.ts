import { Router } from "express";
import { dominios } from "./dominios.factory.js";
import { dominiosConfig } from "../config/dominios.config.js";

const routerDominios = Router();

for (const [chave, config] of Object.entries(dominiosConfig)) {
    routerDominios.use(
        `/api/${config.rota}`,
        dominios[chave].router
    );
}

export default routerDominios;