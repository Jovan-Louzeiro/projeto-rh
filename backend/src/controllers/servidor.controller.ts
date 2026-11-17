import type { Request, Response } from "express";
import { ServidorService } from "@/services/servidor.service.js";
import { CrudController } from "@/controllers/crud.controller.js";
import { ServidorQuery, ServidorSchemas } from "@/schemas/servidor.schemas.js";
import { obterUsuario } from "@/middlewares/auth.js";
import z from "zod";
import { MatriculaSchemas } from "@/schemas/matricula.schemas.js";
import { HistoricoFuncionalSchemas } from "@/schemas/historicoFuncional.schema.js";
import { Prisma } from "#/generated/prisma/client.js";
import { TipoDocumentoDigitalizado } from "#/generated/prisma/enums.js";
import { obterDadosFormulario } from "@/utils/dados-formulario.js";
import { AppError } from "@/errors/app.errors.js";

export class ServidorController extends CrudController<ServidorService, ServidorSchemas> {

    constructor() {

        super(
            new ServidorService(),
            new ServidorSchemas(),
            "idServidor"
        )



    }

    private matriculaSchema = new MatriculaSchemas()
    private historicosFuncionaisShemas = new HistoricoFuncionalSchemas()

    adicionar = async (req: Request, res: Response) => {
        const dados = this.validarBody(this.schemas.adicionar, obterDadosFormulario(req))
        const arquivosRecebidos = req.files as Record<string, Express.Multer.File[]> | undefined
        const camposDocumento = [
            { arquivo: "arquivo_certidao", campo: "certidao", tipo: TipoDocumentoDigitalizado.CERTIDAO },
            { arquivo: "arquivo_cnh", campo: "cnh", tipo: TipoDocumentoDigitalizado.CNH },
            { arquivo: "arquivo_ctps", campo: "ctps", tipo: TipoDocumentoDigitalizado.CTPS },
            { arquivo: "arquivo_identidade", campo: "identidade", tipo: TipoDocumentoDigitalizado.IDENTIDADE },
            { arquivo: "arquivo_tituloEleitor", campo: "titulo_eleitor", tipo: TipoDocumentoDigitalizado.TITULO_ELEITOR },
        ] as const
        const arquivosDigitalizados = camposDocumento.flatMap(({ arquivo, campo, tipo }) => {
            const arquivoRecebido = arquivosRecebidos?.[arquivo]?.[0]
            if (!arquivoRecebido) return []
            if (!dados[campo]) {
                throw new AppError(422, "O arquivo digitalizado deve acompanhar os dados do documento correspondente.")
            }
            return [{
                tipo,
                nome: arquivoRecebido.originalname,
                mime_type: arquivoRecebido.mimetype,
                tamanho: arquivoRecebido.size,
                conteudo: Uint8Array.from(arquivoRecebido.buffer),
            }]
        })

        const usuario = obterUsuario(req)
        const resposta = await this.service.adicionar(usuario.nome, dados, arquivosDigitalizados)
        return res.status(201).json({
            mensagem: `${this.nome} cadastrado com sucesso`,
            dados: resposta,
        })
    }

    salvarDocumentoDigitalizado = async (req: Request, res: Response) => {
        const { idServidor } = this.validarParams({ idServidor: req.params.idServidor })
        const tipo = this.validarQuery(
            z.enum(TipoDocumentoDigitalizado),
            req.params.tipo,
        )
        const arquivo = req.file
        if (!arquivo) {
            throw new AppError(400, "Selecione um arquivo digitalizado.")
        }

        const resposta = await this.service.salvarDocumentoDigitalizado(idServidor, tipo, {
            nome: arquivo.originalname,
            mime_type: arquivo.mimetype,
            tamanho: arquivo.size,
            conteudo: Uint8Array.from(arquivo.buffer),
        })
        return res.json(resposta)
    }

    baixarDocumentoDigitalizado = async (req: Request, res: Response) => {
        const { idServidor } = this.validarParams({ idServidor: req.params.idServidor })
        const tipo = this.validarQuery(
            z.enum(TipoDocumentoDigitalizado),
            req.params.tipo,
        )
        const arquivo = await this.service.obterDocumentoDigitalizado(idServidor, tipo)
        if (!arquivo) {
            throw new AppError(404, "Não há arquivo digitalizado para este documento.")
        }

        res.setHeader("Content-Type", arquivo.mime_type)
        res.setHeader("Content-Length", arquivo.tamanho)
        res.setHeader("Content-Disposition", `attachment; filename*=UTF-8''${encodeURIComponent(arquivo.nome)}`)
        res.setHeader("Cache-Control", "private, no-store")
        return res.send(Buffer.from(arquivo.conteudo))
    }

    listarServidores = async (req: Request, res: Response) => {

        const {
            servidorSelect,
            matriculasSelect,
            historicosFuncionaisSelect,
            matricula_ativo: matriculaAtivo,
            ...queryCompartilhada
        } = req.query
        const { ativo: servidorAtivo, ...filtrosQuery } = queryCompartilhada

        const camposSelect = {

            servidorSelect: typeof servidorSelect === "string"
                ? this.validarQuery(this.schemas.queryParams, { select: servidorSelect.split(",") }).select
                : undefined,

            matriculasSelect: typeof matriculasSelect === "string"
                ? this.validarQuery(this.matriculaSchema.queryParams, { select: matriculasSelect.split(",") }).select
                : undefined,

            historicosFuncionaisSelect: typeof historicosFuncionaisSelect === "string"
                ? this.validarQuery(this.historicosFuncionaisShemas.queryParams, { select: historicosFuncionaisSelect.split(",") }).select
                : undefined

        }

        const filtrosValidados = {

            servidorFiltro: this.validarQuery(this.schemas.queryParams, {
                ...filtrosQuery,
                ...(servidorAtivo !== undefined ? { ativo: servidorAtivo } : {}),
            }),

            matriculasFiltro: this.validarQuery(this.matriculaSchema.queryParams, {
                ...filtrosQuery,
                ...(matriculaAtivo !== undefined ? { ativo: matriculaAtivo } : {}),
            }),

            historicosFuncionaisFiltro: this.validarQuery(this.historicosFuncionaisShemas.queryParams, filtrosQuery)

        }

        const filtros = Object.fromEntries(
            Object.entries(filtrosValidados).filter(
                ([, valor]) =>
                    valor !== null &&
                    Object.keys(valor).length > 0
            )
        )

        const resposta = await this.service.listarServidores(
            {
                filtros: filtros,

                camposSelect: camposSelect
            }
        )


        return res.json(resposta)

    }

    procurarServidor = async (req: Request, res: Response) => {

        const { idServidor } = this.validarParams(req.params)

        const resposta = await this.service.procurar(idServidor)

        return res.json(resposta);
    }

    atualizar = async (req: Request, res: Response) => {

        const { idServidor } = this.validarParams(req.params)

        const body = this.validarBody(this.schemas.atualizar, req.body)

        const usuario = obterUsuario(req)

        const resposta = await this.service.atualizar(usuario.nome, idServidor, body)

        return res.json({
            mensagem: `${this.nome} atualizado com sucesso`,
            dados: resposta
        });

    }

    deletar = async (req: Request, res: Response) => {

        const { idServidor } = this.validarParams(req.params)

        const usuario = obterUsuario(req)

        const resposta = await this.service.deletar(idServidor, usuario.nome)

        return res.json({
            mensagem: `${this.nome} Excluído com sucesso`,
            dados: resposta
        });

    }

    contarServidores = async (req: Request, res: Response) => {

        const { matricula_ativo: matriculaAtivo, ativo: servidorAtivo, ...filtrosQuery } = req.query


        const filtrosValidados = {

            servidorFiltro: this.validarQuery(this.schemas.queryParams, {
                ...filtrosQuery,
                ...(servidorAtivo !== undefined ? { ativo: servidorAtivo } : {}),
            }),

            matriculasFiltro: this.validarQuery(this.matriculaSchema.queryParams, {
                ...filtrosQuery,
                ...(matriculaAtivo !== undefined ? { ativo: matriculaAtivo } : {}),
            }),

            historicosFuncionaisFiltro: this.validarQuery(this.historicosFuncionaisShemas.queryParams, filtrosQuery)

        }

        const filtros = Object.fromEntries(
            Object.entries(filtrosValidados).filter(
                ([, valor]) =>
                    valor !== null &&
                    Object.keys(valor).length > 0
            )
        )

        const resposta = await this.service.contarServidores({filtros: filtros})

        return res.json({"total": resposta})

    }

    verificarCpf = async (req: Request, res: Response) => {
        const { cpf } = this.validarBody(this.schemas.cpfDisponibilidade, req.body)
        const disponivel = await this.service.cpfDisponivel(cpf)

        return res.json({ disponivel })
    }

    detalharServidor = async (req: Request, res: Response) => {

        const { idServidor } = this.validarParams(req.params)

        const resposta = await this.service.detalharServidor(idServidor);

        return res.json(resposta);

    }

}