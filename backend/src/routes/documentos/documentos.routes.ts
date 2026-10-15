import { Autorizacoes, autorizacoesPadrao, DocumentosSchemas } from "@/types/crud.types.js";
import { DocumentosController } from "@/controllers/documentos/documentos.controller.js";
import { autorizar } from "@/middlewares/auth.js";
import { validate } from "@/middlewares/validate.js";
import { CrudRoutes } from "@/routes/crud.routes.js";
import { DominioController } from "@/controllers/dominios/dominios.controller.js";

export class DocumentosRoute
<TDocumentoController extends DocumentosController<any, any>>
extends CrudRoutes<TDocumentoController>{

    constructor(
        protected controller: TDocumentoController,
        autorizacoes?: Partial<Autorizacoes>
    ) {
        super(
            controller,
            autorizacoes
        )

        this.registrarSchema()
        this.registrar()

    }

    protected registrar(): void {
    
            this.router.get(
                "/",
                autorizar(...this.autorizacoes.procurar),
                this.controller.procurarContato
            );
    
            this.router.post(
                "/",
                autorizar(...this.autorizacoes.adicionar),
                this.controller.adicionar
            );
    
            this.router.put(
                "/",
                autorizar(...this.autorizacoes.atualizar),
                this.controller.atualizar
            );
    
            this.router.delete(
                "/",
                autorizar(...this.autorizacoes.deletar),
                this.controller.deletar
            );
    
        }

}