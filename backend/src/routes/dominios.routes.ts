import { Router } from "express";

import { DominioController } from "../controllers/dominios.controller.js";
import { autorizar } from "../middlewares/auth.js";
import { validate } from "../middlewares/validate.js";
import { DominioSchemas } from "../schemas/dominosSchema.js";
import type { DominioServices } from "../services/dominios.service.js";
import { AutorizacoesDominio } from "../types/dominio.types.js";
import { PermissaoUsuario } from "../../generated/prisma/enums.js";

const autorizacoesPadrao: AutorizacoesDominio = {
    listar: [PermissaoUsuario.RH, PermissaoUsuario.ADMIN],
    procurar: [PermissaoUsuario.RH, PermissaoUsuario.ADMIN],
    adicionar: [PermissaoUsuario.ADMIN],
    atualizar: [PermissaoUsuario.ADMIN],
    deletar: [PermissaoUsuario.ADMIN],
};


export class DominiosRoutes {

    public readonly router: Router;
    private readonly controller: DominioController;
    private readonly autorizacoes: AutorizacoesDominio;

    constructor(
        private readonly services: DominioServices,
        private readonly schema: DominioSchemas,
        private readonly nome: string,
        autorizacoes?: Partial<AutorizacoesDominio>
    ) {
        this.autorizacoes = {
            ...autorizacoesPadrao,
            ...autorizacoes
        }

        this.router = Router();
        this.controller = new DominioController(this.services, this.nome);

        this.registrar();
    }

    private registrar(): void {

        this.router.get(
            "/",
            autorizar(...this.autorizacoes.listar),
            this.controller.listar
        );

        this.router.get(
            "/:id",
            autorizar(...this.autorizacoes.procurar),
            this.controller.procurar
        );

        this.router.post(
            "/",
            autorizar(...this.autorizacoes.adicionar),
            validate(this.schema.adicionar),
            this.controller.adicionar
        );

        this.router.patch(
            "/:id",
            autorizar(...this.autorizacoes.atualizar),
            validate(this.schema.atualizar),
            this.controller.atualizar
        );

        this.router.delete(
            "/:id",
            autorizar(...this.autorizacoes.deletar),
            this.controller.deletar
        );
    }
}