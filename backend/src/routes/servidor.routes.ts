import { ServidorController } from "../controllers/servidor.controller.js";
import { autorizar } from "../middlewares/auth.js";
import { validate } from "../middlewares/validate.js";
import { ServidorSchemas } from "../schemas/servidor.schemas.js";
import { CrudRoutes } from "./crud.routes.js";
import { CertidaoRouter } from "./documentos/certidao.routes.js";
import { CnhRouter } from "./documentos/cnh.routes.js";
import { CtpsRouter } from "./documentos/ctps.routes.js";
import { IdentidadeRouter } from "./documentos/identidade.routes.js";
import { TituloEleitorRouter } from "./documentos/tituloEleitor.routes.js";

export class ServidorRouter extends CrudRoutes<ServidorSchemas>{

    constructor(private readonly servidorController = new ServidorController){
        super(
            servidorController,
            new ServidorSchemas(),
            undefined,
            "idServidor"
        )

        this.documentos()

    }

    private documentos(): void {

        this.router.get(
            `/:${this.parametroId}/detalharDocumentos`,
            autorizar(...this.autorizacoes.procurar),
            validate(this.schema.params, "params"),
            this.servidorController.detalharDocumentos
        )

        this.router.use(`/:${this.parametroId}/certidao`, new CertidaoRouter().router)

        this.router.use(`/:${this.parametroId}/cnh`, new CnhRouter ().router)

        this.router.use(`/:${this.parametroId}/ctps`, new CtpsRouter().router)

        this.router.use(`/:${this.parametroId}/identidade`, new IdentidadeRouter().router)

        this.router.use(`/:${this.parametroId}/tituloEleitor`, new TituloEleitorRouter().router)
    }

}