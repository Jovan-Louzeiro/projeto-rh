import { Router } from "express";
import { LicencasController } from "@/controllers/licencas.controller.js";
import { autorizar } from "@/middlewares/auth.js";
import { uploadAnexoLicenca } from "@/middlewares/upload-anexo-licenca.js";

export class LicencasServidorRouter {
  readonly router = Router({ mergeParams: true });
  private readonly controller = new LicencasController();

  constructor() {
    this.router.get("/", autorizar("ADMIN", "RH"), this.controller.listarPorServidor);
    this.router.post("/", autorizar("ADMIN", "RH"), uploadAnexoLicenca, this.controller.criarParaServidor);
  }
}
