import type { DocumentosServices } from "@/services/documentos/documentos.service.js";
import { Request, Response } from "express";
import { obterUsuario } from "@/middlewares/auth.js";
import { CrudController } from "@/controllers/crud.controller.js";
import { DocumentosSchema } from "@/schemas/documentos/documentos.schemas.js";

export class DocumentosController<
TDocumentosService extends DocumentosServices<any, any>,
TDocumentosSchemas extends DocumentosSchema
>
extends CrudController<TDocumentosService, TDocumentosSchemas>{

    constructor(
        protected documentoService: TDocumentosService,
        protected documentoSchemas: TDocumentosSchemas
    ) {

        super(
            documentoService,
            documentoSchemas,
            "idService"
        )

    }

    procurarContato = async(req: Request, res: Response) => {

        const {idServidor} = this.validarParams(req.params)

        const resposta = await this.service.procurar(idServidor)

        return res.json(resposta);

    }

    adicionar = async (req: Request, res: Response) => {

        const {idServidor} = this.validarParams(req.params);

        req.body.servidor_id = idServidor

        const body = this.validarBody(this.schemas.adicionar, req.body);

        const usuario = obterUsuario(req);

        const resposta = await this.documentoService.adicionar(usuario.nome, body);

        return res.status(201).json({
            mensagem: `${this.nome} cadastrado com sucesso`,
            dados: resposta,
        });
    };

    atualizar = async (req: Request, res: Response) => {

        const {idServidor} = this.validarParams(req.params)

        req.body.servidor_id = idServidor

        const body = this.validarBody(this.schemas.atualizar, req.body)

        const usuario = obterUsuario(req);

        const resposta = await this.service.atualizar(usuario.nome, idServidor, body)

        return res.json({
            mensagem: `${this.nome} atualizado com sucesso`,
            dados: resposta
        });

    }

    deletar = async (req: Request, res: Response) => {

        const {idServidor} = this.validarParams(req.params)

        const usuario = obterUsuario(req);

        const resposta = await this.service.deletar(idServidor, usuario.nome)

        return res.json({
            mensagem: `${this.nome} Excluído com sucesso`,
            dados: resposta
        });

    }

}