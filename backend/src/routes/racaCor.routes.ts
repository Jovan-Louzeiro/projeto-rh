import { Router } from "express";
import { adicionar, atualizar, deletar, listar, procurar } from "../controllers/racaCor.controller.js";
import { autorizar } from "../middlewares/auth.js";
import { validate } from "../middlewares/validate.js";
import { adicionarRacaCorSchema, atualizarRacaCorSchema } from "../schemas/racaCor.Schema.js";

const router = Router()

router.get("/", autorizar("RH", "ADMIN"), listar);

router.get("/:id", autorizar("RH", "ADMIN"), procurar)

router.post("/", autorizar("ADMIN"), validate(adicionarRacaCorSchema), adicionar)

router.delete("/:id", autorizar("ADMIN"), deletar)

router.patch("/:id", autorizar("ADMIN"), validate(atualizarRacaCorSchema), atualizar)

export default router