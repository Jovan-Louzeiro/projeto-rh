import type { DocumentosServices } from "@/services/documentos/documentos.service.js";
import { Request, Response } from "express";
import { obterUsuario } from "@/middlewares/auth.js";
import { CrudController } from "@/controllers/crud.controller.js";
import { DocumentosSchema } from "@/schemas/documentos/documentos.schemas.js";
import { ServidorService } from "@/services/servidor.service.js";
import { TipoDocumentoDigitalizado } from "#/generated/prisma/enums.js";
import { obterDadosFormulario } from "@/utils/dados-formulario.js";
import { AppError } from "@/errors/app.errors.js";
import z from "zod";

export class DocumentosController<
TDocumentosService extends DocumentosServices<any, any>,
TDocumentosSchemas extends DocumentosSchema
>
extends CrudController<TDocumentosService, TDocumentosSchemas>{

private readonly servidorService = new ServidorService()

private dadosComServidor(req: Request, servidorId: number) {
    const dados = obterDadosFormulario(req)
    if (!dados || typeof dados !== "object" || Array.isArray(dados)) {
        throw new AppError(400, "Os dados do documento devem conter um objeto JSON.")
    }
    return { ...dados, servidor_id: servidorId }
}

registrarSchema = (req: Request, res: Response) => {
    const operacao = req.query.operacao
    if (operacao !== "adicionar" && operacao !== "atualizar") {
        res.status(400).json({ erro: "A operação deve ser adicionar ou atualizar" })
        return
    }

    const schema = z.toJSONSchema(this.documentoSchemas.schemaServidor, {
        unrepresentable: "any",
    })
    return res.json({ operacao, schema })
}

    constructor(
        protected documentoService: TDocumentosService,
    protected documentoSchemas: TDocumentosSchemas,
    protected tipoDocumentoDigitalizado: TipoDocumentoDigitalizado
    ) {

        super(
            documentoService,
            documentoSchemas,
            "idService"
        )

    }

    procurarDocumento = async(req: Request, res: Response) => {

        const {idServidor} = this.validarParams(req.params)

        const resposta = await this.service.procurar(idServidor)

        return res.json(resposta);

    }

    adicionar = async (req: Request, res: Response) => {

        const {idServidor} = this.validarParams(req.params);

        const body = this.validarBody(this.schemas.adicionar, this.dadosComServidor(req, idServidor));

        const usuario = obterUsuario(req);

        const resposta = await this.documentoService.adicionar(usuario.nome, body);
        const arquivoDigitalizado = req.file
            ? await this.servidorService.salvarDocumentoDigitalizado(idServidor, this.tipoDocumentoDigitalizado, {
                nome: req.file.originalname,
                mime_type: req.file.mimetype,
                tamanho: req.file.size,
                conteudo: Uint8Array.from(req.file.buffer),
            })
            : undefined;

        return res.status(201).json({
            mensagem: `${this.nome} cadastrado com sucesso`,
            dados: resposta,
            arquivoDigitalizado,
        });
    };

    atualizar = async (req: Request, res: Response) => {

        const {idServidor} = this.validarParams(req.params)

        const body = this.validarBody(this.schemas.atualizar, this.dadosComServidor(req, idServidor))

        const usuario = obterUsuario(req);

        const resposta = await this.service.atualizar(usuario.nome, idServidor, body)
        const arquivoDigitalizado = req.file
            ? await this.servidorService.salvarDocumentoDigitalizado(idServidor, this.tipoDocumentoDigitalizado, {
                nome: req.file.originalname,
                mime_type: req.file.mimetype,
                tamanho: req.file.size,
                conteudo: Uint8Array.from(req.file.buffer),
            })
            : undefined

        return res.json({
            mensagem: `${this.nome} atualizado com sucesso`,
            dados: resposta,
            arquivoDigitalizado,
        });

    }

    deletar = async (req: Request, res: Response) => {

        const {idServidor} = this.validarParams(req.params)

        const usuario = obterUsuario(req);

        const resposta = await this.service.deletar(idServidor, usuario.nome)
        await this.servidorService.removerDocumentoDigitalizado(idServidor, this.tipoDocumentoDigitalizado)

        return res.json({
            mensagem: `${this.nome} Excluído com sucesso`,
            dados: resposta
        });

    }

}