import { Router } from "express";
import { adicionar, atualizar, deletar, listar, procurar } from "../controllers/sexo.controller.js";
import { Request, Response } from "express";
import { validate } from "../middlewares/validate.js";
import { sexoSchema } from "../schemas/sexo.schema.js";

const router = Router()

router.get("/", listar);

router.get("/:id", procurar)

router.post("/", validate(sexoSchema), adicionar)

router.delete("/:id", deletar)

router.put("/:id", validate(sexoSchema), atualizar)

export default router;