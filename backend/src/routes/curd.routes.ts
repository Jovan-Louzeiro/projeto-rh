import { Router } from "express";
import { Autorizacoes } from "../types/crud.types.js";
import { DominioController } from "../controllers/dominios/dominios.controller.js";
import { PermissaoUsuario } from "../../generated/prisma/enums.js";
import { autorizar } from "../middlewares/auth.js";
import { validate } from "../middlewares/validate.js";

const autorizacoesPadrao: Autorizacoes = {
    listar: [PermissaoUsuario.RH, PermissaoUsuario.ADMIN],
    procurar: [PermissaoUsuario.RH, PermissaoUsuario.ADMIN],
    adicionar: [PermissaoUsuario.ADMIN],
    atualizar: [PermissaoUsuario.ADMIN],
    deletar: [PermissaoUsuario.ADMIN],
};

export class CurdRoutes {

    public readonly router: Router;
    private readonly autorizacoes: Autorizacoes;

    constructor(
        private readonly controller: DominioController,
        private readonly schema: any,
        autorizacoes?: Partial<Autorizacoes>
    ) {
        this.autorizacoes = {
            ...autorizacoesPadrao,
            ...autorizacoes
        }

        this.router = Router();

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