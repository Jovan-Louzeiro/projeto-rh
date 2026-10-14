import { Router } from "express";
import { Autorizacoes, autorizacoesPadrao, CrudSchema } from "@/types/crud.types.js";
import { autorizar } from "@/middlewares/auth.js";
import { validate } from "@/middlewares/validate.js";
import { CrudController } from "@/controllers/crud.controller.js";
import z from "zod";

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

        this.registrarSchema();

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


    protected registrarSchema(): void {
        this.router.get(
            "/schemas",
            autorizar(...this.autorizacoes.listar),
            (req, res, next) => {
                try {
                    const operacao = req.query.operacao;

                    if (
                        operacao !== "adicionar" &&
                        operacao !== "atualizar"
                    ) {
                        res.status(400).json({
                            erro: "A operação deve ser adicionar ou atualizar"
                        });
                        return;
                    }

                    const schema =
                        operacao === "adicionar"
                            ? this.schema.adicionar
                            : this.schema.atualizar;

                    const jsonSchema = z.toJSONSchema(schema, {
                        unrepresentable: "any"
                    });

                    res.json({
                        operacao,
                        schema: jsonSchema
                    });
                } catch (erro) {
                    next(erro);
                }
            }
        );
    }

}