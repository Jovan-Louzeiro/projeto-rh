import { Router } from "express";
import { FeriasController } from "@/controllers/ferias.controller.js";
import { autorizar } from "@/middlewares/auth.js";

export class FeriasServidorRouter {
  readonly router = Router({ mergeParams: true });
  private readonly controller = new FeriasController();

  constructor() {
    this.router.get("/", autorizar("ADMIN", "RH"), this.controller.listarPorServidor);
    this.router.post("/", autorizar("ADMIN", "RH"), this.controller.criarParaServidor);
  }
}
