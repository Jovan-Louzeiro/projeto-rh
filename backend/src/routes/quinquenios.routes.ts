import { Router } from "express";
import { QuinqueniosController } from "@/controllers/quinquenios.controller.js";
import { autorizar } from "@/middlewares/auth.js";
import { uploadAtoQuinquenio } from "@/middlewares/upload-ato-quinquenio.js";

export class QuinqueniosRouter {
  readonly router = Router();
  private readonly controller = new QuinqueniosController();

  constructor() {
    this.router.get("/", autorizar("ADMIN", "RH"), this.controller.listar);
    this.router.post("/", autorizar("ADMIN", "RH"), uploadAtoQuinquenio, this.controller.criar);
    this.router.get("/:id/documento", autorizar("ADMIN", "RH"), this.controller.baixarDocumento);
    this.router.post("/:id/cancelar", autorizar("ADMIN", "RH"), this.controller.cancelar);
    this.router.get("/:id", autorizar("ADMIN", "RH"), this.controller.procurar);
    this.router.put("/:id", autorizar("ADMIN", "RH"), uploadAtoQuinquenio, this.controller.atualizar);
  }
}
