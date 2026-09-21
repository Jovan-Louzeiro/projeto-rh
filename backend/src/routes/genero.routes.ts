import { Router } from "express";
import { generoController } from "../controllers/dominios.controller.js";
import { autorizar } from "../middlewares/auth.js";
import { validate } from "../middlewares/validate.js";
import { adicionarGeneroSchema, atualizarGeneroSchema } from "../schemas/genero.schema.js";

const router = Router()

router.get("/", autorizar("RH", "ADMIN"), generoController.listar);

router.get("/:id", autorizar("RH", "ADMIN"), generoController.procurar)

router.post("/", autorizar("ADMIN"), validate(adicionarGeneroSchema), generoController.adicionar)

router.delete("/:id", autorizar("ADMIN"), generoController.deletar)

router.patch("/:id", autorizar("ADMIN"), validate(atualizarGeneroSchema), generoController.atualizar)

export default router