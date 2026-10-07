import { Router } from "express";
import { Autorizacoes, autorizacoesPadrao, CrudSchema } from "../types/crud.types.js";
import { autorizar } from "../middlewares/auth.js";
import { validate } from "../middlewares/validate.js";
import { CrudController } from "../controllers/crud.controller.js";

export class CrudRoutes<TSchema extends CrudSchema> {

    public readonly router: Router;
    protected readonly autorizacoes: Autorizacoes;

    constructor(
        protected controller: CrudController,
        protected readonly schema: TSchema,
        autorizacoes?: Partial<Autorizacoes>,
        protected readonly parametroId = "id"
    ) {
        this.autorizacoes = {
            ...autorizacoesPadrao,
            ...autorizacoes
        }

        this.router = Router();

        this.registrar();
    } 

    protected registrar(): void {

    this.router.get(
        "/",
        autorizar(...this.autorizacoes.listar),
        this.controller.listar
    );

    this.router.get(
        `/:${this.parametroId}`,
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

    this.router.patch(
        `/:${this.parametroId}`,
        autorizar(...this.autorizacoes.atualizar),
        validate(this.schema.params, "params"),
        validate(this.schema.atualizar, "body"),
        this.controller.atualizar
    );

    this.router.delete(
        `/:${this.parametroId}`,
        autorizar(...this.autorizacoes.deletar),
        validate(this.schema.params, "params"),
        this.controller.deletar
    );
}
}