import { HistoricoFuncionalController } from "@/controllers/historicoFuncional.controller.js";
import { autorizar } from "@/middlewares/auth.js";
import { CrudRoutes } from "@/routes/crud.routes.js";

export class HistoricoFuncionalRouter extends CrudRoutes<HistoricoFuncionalController> {

    constructor() {

        super(
            new HistoricoFuncionalController()
        )

        this.registrarSchema()
        this.registrar()

    }

    registrar() {

        this.router.get(
            "/",
            autorizar(...this.autorizacoes.procurar),
            this.controller.listarHistoricoFuncionalPorServidor
        );

        this.router.get(
            "/:idHistoricoFuncional",
            autorizar(...this.autorizacoes.procurar),
            this.controller.procurarHistoricoFuncionalServidor
        );

        this.router.post(
            "/",
            autorizar(...this.autorizacoes.adicionar),
            this.controller.adicionarHistoricoFuncional
        );

        this.router.put(
            "/:idHistoricoFuncional",
            autorizar(...this.autorizacoes.atualizar),
            this.controller.atualizarHistoricoFuncional
        );

        this.router.delete(
            "/:idHistoricoFuncional",
            autorizar(...this.autorizacoes.deletar),
            this.controller.deletarHistoricoFuncional
        );
    }

}