import { DocumentosCadastraisController } from "@/controllers/registros_servidor/documentos_cadastrais/documentosCadastrais.controller.js";
import { autorizar } from "@/middlewares/auth.js";
import { validate } from "@/middlewares/validate.js";
import { CertidaoRouter } from "@/routes/registros_servidor/documentos_cadastrais/certidao.routes.js";
import { CnhRouter } from "@/routes/registros_servidor/documentos_cadastrais/cnh.routes.js";
import { CtpsRouter } from "@/routes/registros_servidor/documentos_cadastrais/ctps.routes.js";
import { IdentidadeRouter } from "@/routes/registros_servidor/documentos_cadastrais/identidade.routes.js";
import { TituloEleitorRouter } from "@/routes/registros_servidor/documentos_cadastrais/tituloEleitor.routes.js";
import { Autorizacoes, autorizacoesPadrao, DocumentosSchemas } from "@/types/crud.types.js";
import { Router } from "express";

export class RegistrosServidorRoute {

    public readonly router: Router
    public readonly autorizacoes: Autorizacoes

    constructor(
        protected controller: DocumentosCadastraisController,
        private readonly schema: DocumentosSchemas,
        autorizacoes?: Partial<Autorizacoes>
    ) {

        this.autorizacoes = {
            ...autorizacoesPadrao,
            ...autorizacoes
        }

        this.router = Router({ mergeParams: true });

        this.registrar();

    }

    private registrar(): void {

        this.router.get(
            "/",
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
            "/",
            autorizar(...this.autorizacoes.atualizar),
            validate(this.schema.params, "params"),
            validate(this.schema.atualizar, "body"),
            this.controller.atualizar
        );

        this.router.delete(
            "/",
            autorizar(...this.autorizacoes.deletar),
            validate(this.schema.params, "params"),
            this.controller.deletar
        );

    }
}