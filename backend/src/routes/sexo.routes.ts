import { Router } from "express";
import { adicionar, atualizar, deletar, listar, procurar } from "../controllers/sexo.controller.js";
import { Request, Response } from "express";

const router = Router()

router.get("/", listar);

router.get("/:id", procurar)

router.post("/adicionar", adicionar)

router.delete("/deletar/:id", deletar)

router.put("/atualizar/:id", atualizar)

export default router;