import { Router } from "express";
import { sexoController } from "../controllers/dominios.controller.js";
import { validate } from "../middlewares/validate.js";
import { adicionarSexoSchema, atualizarSexoSchema } from "../schemas/sexo.schema.js";
import { autorizar } from "../middlewares/auth.js";

const router = Router()

router.get("/", autorizar("RH", "ADMIN"), sexoController.listar);

router.get("/:id", autorizar("RH", "ADMIN"), sexoController.procurar)

router.post("/", autorizar("ADMIN"), validate(adicionarSexoSchema), sexoController.adicionar)

router.delete("/:id", autorizar("ADMIN"), sexoController.deletar)

router.patch("/:id", autorizar("ADMIN"), validate(atualizarSexoSchema), sexoController.atualizar)

export default router;