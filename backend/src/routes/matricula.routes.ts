import { MatriculaController } from "@/controllers/matricula.controller.js";
import { autorizar } from "@/middlewares/auth.js";
import { CrudRoutes } from "@/routes/crud.routes.js";

export class MatriculaRouter extends CrudRoutes<MatriculaController> {

    constructor() {

        super(
            new MatriculaController,
        )

        this.registrarSchema()
        this.registrar()

    }

    registrar() {

        this.router.get(
            "/",
            autorizar(...this.autorizacoes.procurar),
            this.controller.listarMatriculaPorServidor
        );

        this.router.get(
            "/:id",
            autorizar(...this.autorizacoes.procurar),
            this.controller.procurarMatriculaServidor
        );

        this.router.post(
            "/",
            autorizar(...this.autorizacoes.adicionar),
            this.controller.adicionarMatricula
        );

        this.router.put(
            "/:id",
            autorizar(...this.autorizacoes.atualizar),
            this.controller.atualizarMatricula
        );

        this.router.delete(
            "/:id",
            autorizar(...this.autorizacoes.deletar),
            this.controller.deletarMatricula
        );
    }
}