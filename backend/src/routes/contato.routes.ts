import { CrudController } from "@/controllers/crud.controller.js";
import { ContatoController } from "@/controllers/contato.controller.js";
import { autorizar } from "@/middlewares/auth.js";
import { validate } from "@/middlewares/validate.js";
import { CrudRoutes } from "@/routes/crud.routes.js";
import { ContatoSchema } from "@/schemas/contato.schemas.js";
import { Router } from "express";

export class ContatoRouter extends CrudRoutes<ContatoController>{

    constructor(){

        super(
            new ContatoController()
        )

        this.registrarSchema()
        this.registrar()
    }

    protected registrar(): void {
    
            this.router.get(
                "/",
                autorizar(...this.autorizacoes.procurar),
                this.controller.listarPorServidor
            );

            this.router.get(
                "/:id",
                autorizar(...this.autorizacoes.procurar),
                this.controller.procurarContato
            );
    
            this.router.post(
                "/",
                autorizar(...this.autorizacoes.adicionar),
                this.controller.adicionar
            );
    
            this.router.put(
                "/:id",
                autorizar(...this.autorizacoes.atualizar),
                this.controller.atualizar
            );
    
            this.router.delete(
                "/:id",
                autorizar(...this.autorizacoes.deletar),
                this.controller.deletar
            );
    
        }

}