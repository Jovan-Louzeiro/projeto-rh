import { Router } from "express";

const router = Router()

router.get("/", listar)

router.get("/:id", procurar)

router.post("/:id", adicionar)

router.delete("/:id", deletar)

router.put("/:id", atualizar)

export default router