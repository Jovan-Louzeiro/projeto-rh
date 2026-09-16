import { Router } from "express";
import { autenticar, autorizar } from "../middlewares/auth.js";
import { adicionar, atualizar, deletar, listar, procurar } from "../controllers/usuarios.controller.js";
import { validate } from "../middlewares/validate.js";
import { atualizarSchema, cadastroSchema } from "../schemas/usuario.schema.js";

const router = Router()

router.get("/", autorizar("RH", "ADMIN"), listar)

router.get("/:id", autorizar("RH", "ADMIN"), procurar)

router.post("/", autorizar("ADMIN"), validate(cadastroSchema), adicionar)

router.patch("/:id", autorizar("ADMIN"), validate(atualizarSchema), atualizar)

router.delete("/:id", autorizar("ADMIN"), deletar)

export default router