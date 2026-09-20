import { Router } from "express";
import { adicionar, atualizar, deletar, listar, procurar } from "../controllers/racaCor.controller.js";

const routerRacaCor = Router()

routerRacaCor.get("/", listar)

routerRacaCor.get("/:id", procurar)

routerRacaCor.post("/", adicionar)

routerRacaCor.delete("/:id", deletar)

routerRacaCor.patch("/:id", atualizar)

export default routerRacaCor