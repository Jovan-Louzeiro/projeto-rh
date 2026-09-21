import { Router } from "express";
import { adicionar, atualizar, deletar, listar, procurar } from "../controllers/comunidadeIndigena.controller.js";
import { autorizar } from "../middlewares/auth.js";
import { validate } from "../middlewares/validate.js";
import { adicionarComunidadeIndigenaSchema, atualizarComunidadeIndigenaSchema } from "../schemas/comunidadeIndigena.schema.js";

const router = Router()

router.get("/", autorizar("RH", "ADMIN"), listar);

router.get("/:id", autorizar("RH", "ADMIN"), procurar)

router.post("/", autorizar("ADMIN"), validate(adicionarComunidadeIndigenaSchema), adicionar)

router.delete("/:id", autorizar("ADMIN"), deletar)

router.patch("/:id", autorizar("ADMIN"), validate(atualizarComunidadeIndigenaSchema), atualizar)

export default router