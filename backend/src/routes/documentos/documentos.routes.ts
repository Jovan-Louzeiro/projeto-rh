import { Router } from "express";
import { Autorizacoes, autorizacoesPadrao, DocumentosSchemas } from "../../types/crud.types.js";
import { DocumentosController } from "../../controllers/documentos/documentos.controller.js";
import { autorizar } from "../../middlewares/auth.js";
import { validate } from "../../middlewares/validate.js";

export class DocumentosRoute {

    public readonly router: Router
    public readonly autorizacoes: Autorizacoes

    constructor(
        protected controller: DocumentosController,
        private readonly schema: DocumentosSchemas,
        autorizacoes?: Partial<Autorizacoes>
    ) {

        this.autorizacoes = {
            ...autorizacoesPadrao,
            ...autorizacoes
        }

        this.router = Router({ mergeParams: true });

        this.registrar();

    }

    private registrar(): void {

        this.router.get(
            "/",
            autorizar(...this.autorizacoes.procurar),
            validate(this.schema.params, "params"),
            this.controller.procurar
        );

        this.router.post(
            "/",
            autorizar(...this.autorizacoes.adicionar),
            validate(this.schema.adicionar, "body"),
            this.controller.adicionar
        );

        this.router.put(
            "/",
            autorizar(...this.autorizacoes.atualizar),
            validate(this.schema.params, "params"),
            validate(this.schema.atualizar, "body"),
            this.controller.atualizar
        );

        this.router.delete(
            "/",
            autorizar(...this.autorizacoes.deletar),
            validate(this.schema.params, "params"),
            this.controller.deletar
        );

    }
}