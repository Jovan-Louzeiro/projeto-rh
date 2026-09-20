import { Router } from "express";
import { adicionar, atualizar, deletar, listar, procurar } from "../controllers/genero.controller.js";

const router = Router()

router.get("/", listar)

router.get("/:id", procurar)

router.post("/", adicionar)

router.delete("/:id", deletar)

router.patch("/:id", atualizar)

export default router