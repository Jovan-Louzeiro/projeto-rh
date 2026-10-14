import { ServidorController } from "@/controllers/servidor.controller.js";
import { autorizar } from "@/middlewares/auth.js";
import { validate } from "@/middlewares/validate.js";
import { ServidorSchemas } from "@/schemas/servidor.schemas.js";
import { CrudRoutes } from "@/routes/crud.routes.js";
import { CertidaoRouter } from "@/routes/registros_servidor/documentos_cadastrais/certidao.routes.js";
import { CnhRouter } from "@/routes/registros_servidor/documentos_cadastrais/cnh.routes.js";
import { CtpsRouter } from "@/routes/registros_servidor/documentos_cadastrais/ctps.routes.js";
import { IdentidadeRouter } from "@/routes/registros_servidor/documentos_cadastrais/identidade.routes.js";
import { TituloEleitorRouter } from "@/routes/registros_servidor/documentos_cadastrais/tituloEleitor.routes.js";
import { ContatoRouter } from "@/routes/registros_servidor/contato.routes.js";

export class ServidorRouter extends CrudRoutes<ServidorSchemas>{

    constructor(private readonly servidorController = new ServidorController){
        super(
            servidorController,
            new ServidorSchemas(),
            undefined,
            "idServidor"
        )

        this.registrosServidor()

        this.outrosMetodos()

    }

    private outrosMetodos(): void {
        this.router.get(
            `/:${this.parametroId}/detalharDocumentos`,
            autorizar(...this.autorizacoes.procurar),
            validate(this.schema.params, "params"),
            this.servidorController.detalharDocumentos
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