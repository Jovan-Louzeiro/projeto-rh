import { Router } from "express";
import { dominios } from "./dominios.factory.js";
import { dominiosConfig } from "../config/dominios.config.js";

const router = Router();

for (const [chave, config] of Object.entries(dominiosConfig)) {
    router.use(
        `/api/${config.rota}`,
        dominios[chave].router
    );
}

export default router;