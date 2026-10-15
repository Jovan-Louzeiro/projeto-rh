import { ServidorController } from "@/controllers/servidor.controller.js";
import { autorizar } from "@/middlewares/auth.js";
import { validate } from "@/middlewares/validate.js";
import { ServidorSchemas } from "@/schemas/servidor.schemas.js";
import { CrudRoutes } from "@/routes/crud.routes.js";
import { CertidaoRouter } from "@/routes/documentos/certidao.routes.js";
import { CnhRouter } from "@/routes/documentos/cnh.routes.js";
import { CtpsRouter } from "@/routes/documentos/ctps.routes.js";
import { IdentidadeRouter } from "@/routes/documentos/identidade.routes.js";
import { TituloEleitorRouter } from "@/routes/documentos/tituloEleitor.routes.js";
import { ContatoRouter } from "@/routes/contato.routes.js";

export class ServidorRouter extends CrudRoutes<ServidorController>{

    constructor(){
        super(
            new ServidorController(),
            undefined,
            "idServidor"
        )

        this.registrarRotasCrud()
        
        this.registrosServidor()

        this.outrosMetodos()

    }

    private outrosMetodos(): void {

        this.router.get(
            `/contarServidoresAtivos`,
            autorizar(...this.autorizacoes.procurar),
            this.controller.contarServidoresAtivos
        )

        this.router.get(
            `/:${this.parametroId}/detalhar`,
            autorizar(...this.autorizacoes.procurar),
            this.controller.detalhar
        )
    }

    private registrosServidor(): void {

        this.router.use(`/:${this.parametroId}/certidao`, new CertidaoRouter().router)

        this.router.use(`/:${this.parametroId}/cnh`, new CnhRouter ().router)

        this.router.use(`/:${this.parametroId}/ctps`, new CtpsRouter().router)

        this.router.use(`/:${this.parametroId}/identidade`, new IdentidadeRouter().router)

        this.router.use(`/:${this.parametroId}/tituloEleitor`, new TituloEleitorRouter().router)

        this.router.use(`/:${this.parametroId}/contatos`, new ContatoRouter().router)
    }

}