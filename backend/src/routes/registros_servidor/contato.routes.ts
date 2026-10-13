import { ContatoController } from "@/controllers/registros_servidor/contato.controller.js";
import { autorizar } from "@/middlewares/auth.js";
import { validate } from "@/middlewares/validate.js";
import { RegistrosServidorRoute } from "@/routes/registros_servidor/registros_servidor.routes.js";
import { ContatoSchema } from "@/schemas/registros_servidor/contato.schemas.js";

export class ContatoRouter extends RegistrosServidorRoute<ContatoController>{

    constructor(){

        super(
            new ContatoController(),
            new ContatoSchema()
        )

        this.registrar()
    }

    protected registrar(): void {
    
            this.router.get(
                "/",
                autorizar(...this.autorizacoes.procurar),
                validate(this.schema.params, "params"),
                this.controller.listarPorUsuario
            );

            this.router.get(
                "/:id",
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
                "/:id",
                autorizar(...this.autorizacoes.atualizar),
                validate(this.schema.params, "params"),
                validate(this.schema.atualizar, "body"),
                this.controller.atualizar
            );
    
            this.router.delete(
                "/:id",
                autorizar(...this.autorizacoes.deletar),
                validate(this.schema.params, "params"),
                this.controller.deletar
            );
    
        }

}