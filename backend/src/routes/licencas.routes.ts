import { Router } from "express";
import { LicencasController } from "@/controllers/licencas.controller.js";
import { autorizar } from "@/middlewares/auth.js";
import { uploadAnexoLicenca } from "@/middlewares/upload-anexo-licenca.js";

export class LicencasRouter {
  readonly router = Router();
  private readonly controller = new LicencasController();

  constructor() {
    this.router.get("/", autorizar("ADMIN", "RH"), this.controller.listar);
    this.router.get("/:id/documento", autorizar("ADMIN", "RH"), this.controller.baixarDocumento);
    this.router.post("/:id/cancelar", autorizar("ADMIN", "RH"), this.controller.cancelar);
    this.router.get("/:id", autorizar("ADMIN", "RH"), this.controller.procurar);
    this.router.put("/:id", autorizar("ADMIN", "RH"), uploadAnexoLicenca, this.controller.atualizar);
  }
}
