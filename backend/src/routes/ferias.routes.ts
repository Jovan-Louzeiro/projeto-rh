import { Router } from "express";
import { FeriasController } from "@/controllers/ferias.controller.js";
import { autorizar } from "@/middlewares/auth.js";

export class FeriasRouter {
  readonly router = Router();
  private readonly controller = new FeriasController();

  constructor() {
    this.router.get("/", autorizar("ADMIN", "RH"), this.controller.listar);
    this.router.post("/:id/cancelar", autorizar("ADMIN", "RH"), this.controller.cancelar);
    this.router.get("/:id", autorizar("ADMIN", "RH"), this.controller.procurar);
    this.router.put("/:id", autorizar("ADMIN", "RH"), this.controller.atualizar);
  }
}
