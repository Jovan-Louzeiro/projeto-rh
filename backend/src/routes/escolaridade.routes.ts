import { Router } from "express";
import { escolaridadeController } from "../controllers/dominios.controller.js";
import { autorizar } from "../middlewares/auth.js";
import { validate } from "../middlewares/validate.js";
import { adicionarEscolaridadeSchema, atualizarEscolaridadeSchema } from "../schemas/escolaridadeScrema.js";

const router = Router()

router.get("/", autorizar("RH", "ADMIN"), escolaridadeController.listar);

router.get("/:id", autorizar("RH", "ADMIN"), escolaridadeController.procurar)

router.post("/", autorizar("ADMIN"), validate(adicionarEscolaridadeSchema), escolaridadeController.adicionar)

router.delete("/:id", autorizar("ADMIN"), escolaridadeController.deletar)

router.patch("/:id", autorizar("ADMIN"), validate(atualizarEscolaridadeSchema), escolaridadeController.atualizar)

export default router