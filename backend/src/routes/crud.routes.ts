import { Request, Response, Router } from "express";
import { Autorizacoes, autorizacoesPadrao, CrudSchema } from "@/types/crud.types.js";
import { autorizar } from "@/middlewares/auth.js";
import { validate } from "@/middlewares/validate.js";
import { CrudController } from "@/controllers/crud.controller.js";
import z from "zod";

export class CrudRoutes<TController extends CrudController<any, any>> {

    public readonly router: Router;
    protected readonly autorizacoes: Autorizacoes;

    constructor(
        protected controller: TController,
        autorizacoes?: Partial<Autorizacoes>,
        protected readonly parametroId = "id"
    ) {
        this.autorizacoes = {
            ...autorizacoesPadrao,
            ...autorizacoes
        }


        this.router = Router({ mergeParams: true });

        this.registrarPermissoes()
    }

    protected registrarRotasCrud(): void {

        this.registrarListar()
        this.registrarProcurar()
        this.registrarAdicionar()
        this.registrarAtualizar()
        this.registrarDeletar()

    }

    protected registrarListar(): void {

        this.router.get(
            "/",
            autorizar(...this.autorizacoes.listar),
            this.controller.listar
        );
    }

    protected registrarProcurar(): void {

        this.router.get(
            `/:${this.parametroId}`,
            autorizar(...this.autorizacoes.procurar),
            this.controller.procurarContato
        );

    }

    protected registrarAdicionar() {

        this.router.post(
            "/",
            autorizar(...this.autorizacoes.adicionar),
            this.controller.adicionar
        );

    }


    protected registrarAtualizar() {

        this.router.patch(
            `/:${this.parametroId}`,
            autorizar(...this.autorizacoes.atualizar),
            this.controller.atualizar
        );

    }

    protected registrarDeletar() {

        this.router.delete(
            `/:${this.parametroId}`,
            autorizar(...this.autorizacoes.deletar),
            this.controller.deletar
        );
    }

    protected registrarSchema(rotaSchema = "/schemas"): void {
        this.router.get(
            rotaSchema,
            autorizar(...this.autorizacoes.listar),
            this.controller.registrarSchema
        )
    }

    protected registrarPermissoes(rotaPermissoes = "/permissoes"): void{

        this.router.get(
            rotaPermissoes,
            autorizar("ADMIN", "RH"),
            (req: Request, res: Response)=>{
                return res.status(200).json(
                    this.autorizacoes
                )
            }
        )

    }


}