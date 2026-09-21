import { Router } from "express";
import { racaCorController } from "../controllers/dominios.controller.js";
import { autorizar } from "../middlewares/auth.js";
import { validate } from "../middlewares/validate.js";
import { adicionarRacaCorSchema, atualizarRacaCorSchema } from "../schemas/racaCor.Schema.js";

const router = Router()

router.get("/", autorizar("RH", "ADMIN"), racaCorController.listar);

router.get("/:id", autorizar("RH", "ADMIN"), racaCorController.procurar)

router.post("/", autorizar("ADMIN"), validate(adicionarRacaCorSchema), racaCorController.adicionar)

router.delete("/:id", autorizar("ADMIN"), racaCorController.deletar)

router.patch("/:id", autorizar("ADMIN"), validate(atualizarRacaCorSchema), racaCorController.atualizar)

export default router