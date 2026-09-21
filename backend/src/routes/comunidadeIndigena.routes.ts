import { Router } from "express";
import { comunidadeIndigenaController } from "../controllers/dominios.controller.js";
import { autorizar } from "../middlewares/auth.js";
import { validate } from "../middlewares/validate.js";
import { adicionarComunidadeIndigenaSchema, atualizarComunidadeIndigenaSchema } from "../schemas/comunidadeIndigena.schema.js";

const router = Router()

router.get("/", autorizar("RH", "ADMIN"), comunidadeIndigenaController.listar);

router.get("/:id", autorizar("RH", "ADMIN"), comunidadeIndigenaController.procurar)

router.post("/", autorizar("ADMIN"), validate(adicionarComunidadeIndigenaSchema), comunidadeIndigenaController.adicionar)

router.delete("/:id", autorizar("ADMIN"), comunidadeIndigenaController.deletar)

router.patch("/:id", autorizar("ADMIN"), validate(atualizarComunidadeIndigenaSchema), comunidadeIndigenaController.atualizar)

export default router