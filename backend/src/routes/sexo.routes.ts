import { Router } from "express";
import { adicionar, atualizar, deletar, listar, procurar } from "../controllers/sexo.controller.js";
import { validate } from "../middlewares/validate.js";
import { adicionarSexoSchema, atualizarSexoSchema } from "../schemas/sexo.schema.js";
import { autorizar } from "../middlewares/auth.js";

const router = Router()

router.get("/", autorizar("RH", "ADMIN"), listar);

router.get("/:id", autorizar("RH", "ADMIN"), procurar)

router.post("/", autorizar("ADMIN"), validate(adicionarSexoSchema), adicionar)

router.delete("/:id", autorizar("ADMIN"), deletar)

router.patch("/:id", autorizar("ADMIN"), validate(atualizarSexoSchema), atualizar)

export default router;