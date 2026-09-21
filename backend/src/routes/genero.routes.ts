import { Router } from "express";
import { adicionar, atualizar, deletar, listar, procurar } from "../controllers/genero.controller.js";
import { autorizar } from "../middlewares/auth.js";
import { validate } from "../middlewares/validate.js";
import { adicionarGeneroSchema, atualizarGeneroSchema } from "../schemas/genero.schema.js";

const router = Router()

router.get("/", autorizar("RH", "ADMIN"), listar);

router.get("/:id", autorizar("RH", "ADMIN"), procurar)

router.post("/", autorizar("ADMIN"), validate(adicionarGeneroSchema), adicionar)

router.delete("/:id", autorizar("ADMIN"), deletar)

router.patch("/:id", autorizar("ADMIN"), validate(atualizarGeneroSchema), atualizar)

export default router