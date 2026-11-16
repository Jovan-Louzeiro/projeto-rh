import type { Request, Response } from "express";
import { z } from "zod";
import { AppError } from "@/errors/app.errors.js";
import { obterUsuario } from "@/middlewares/auth.js";
import {
    RequerimentoInputSchema,
    SITUACOES_REQUERIMENTO,
    SituacaoRequerimentoSchema,
} from "@/modules/documentos/schemas/requerimento.schema.js";
import { requerimentoService } from "@/modules/documentos/services/requerimento.service.js";

const idSchema = z.coerce.number().int().positive();
const querySchema = z.strictObject({
    busca: z.string().optional(),
    situacao: z.enum(SITUACOES_REQUERIMENTO).optional(),
    tipo: z.string().optional(),
    servidorId: z.coerce.number().int().positive().optional(),
    dataInicial: z.iso.date().optional(),
    dataFinal: z.iso.date().optional(),
});

function lerDados(body: unknown) {
    if (!body || typeof body !== "object" || !("dados" in body) || typeof body.dados !== "string") {
        throw new AppError(400, "Os dados do requerimento não foram enviados.");
    }

    let dados: unknown;
    try {
        dados = JSON.parse(body.dados);
    } catch {
        throw new AppError(400, "Os dados do requerimento não estão em um formato válido.");
    }
    return RequerimentoInputSchema.parse(dados);
}

function arquivos(req: Request) {
    const enviados = req.files;
    if (!Array.isArray(enviados)) return [];

    return enviados.map(arquivo => {
        const assinaturaValida = arquivo.mimetype === "application/pdf"
            ? arquivo.buffer.subarray(0, 5).toString() === "%PDF-"
            : arquivo.mimetype === "image/jpeg"
                ? arquivo.buffer[0] === 0xff && arquivo.buffer[1] === 0xd8 && arquivo.buffer[2] === 0xff
                : arquivo.mimetype === "image/png"
                    ? arquivo.buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
                    : false;

        if (!assinaturaValida) {
            throw new AppError(422, `O arquivo "${arquivo.originalname}" não corresponde a um PDF, JPG ou PNG válido.`);
        }
        return arquivo;
    });
}

function arquivoPdfAssinado(req: Request) {
    const arquivo = req.file;
    if (!arquivo) {
        throw new AppError(400, "Selecione o PDF assinado pelo servidor.");
    }
    if (arquivo.mimetype !== "application/pdf"
        || arquivo.buffer.subarray(0, 5).toString() !== "%PDF-") {
        throw new AppError(422, "O arquivo enviado não é um PDF válido.");
    }
    return arquivo;
}

function idParam(req: Request, nome = "id") {
    return idSchema.parse(req.params[nome]);
}

export class requerimentoController {
    private readonly service = new requerimentoService();

    listarRequerimentos = async (req: Request, res: Response) => {
        const filtros = querySchema.parse(req.query);
        return res.json(await this.service.listarRequerimentos(filtros));
    };

    procurarRequerimento = async (req: Request, res: Response) => {
        return res.json(await this.service.procurarRequerimento(idParam(req)));
    };

    cadastrarRequerimento = async (req: Request, res: Response) => {
        const usuario = obterUsuario(req);
        const salvo = await this.service.cadastrarRequerimento(
            lerDados(req.body),
            arquivos(req),
            usuario.nome,
            req.ip,
        );
        return res.status(201).json(salvo);
    };

    atualizarRequerimento = async (req: Request, res: Response) => {
        const usuario = obterUsuario(req);
        const salvo = await this.service.atualizarRequerimento(
            idParam(req),
            lerDados(req.body),
            arquivos(req),
            usuario.nome,
            req.ip,
        );
        return res.json(salvo);
    };

    alterarSituacao = async (req: Request, res: Response) => {
        const usuario = obterUsuario(req);
        const dados = SituacaoRequerimentoSchema.parse(req.body);
        return res.json(await this.service.alterarSituacao(
            idParam(req),
            dados.situacao,
            dados.observacao,
            usuario.nome,
        ));
    };

    obterHistorico = async (req: Request, res: Response) => {
        return res.json(await this.service.obterHistorico(idParam(req)));
    };

    obterAnexo = async (req: Request, res: Response) => {
        const anexo = await this.service.obterAnexo(idParam(req), idParam(req, "anexoId"));
        res.setHeader("Content-Type", anexo.tipo);
        res.setHeader("Content-Length", anexo.tamanho);
        res.setHeader("Content-Disposition", `attachment; filename*=UTF-8''${encodeURIComponent(anexo.nome)}`);
        return res.send(Buffer.from(anexo.conteudo));
    };

    deletarAnexo = async (req: Request, res: Response) => {
        await this.service.deletarAnexo(idParam(req), idParam(req, "anexoId"));
        return res.status(204).end();
    };

    adicionarPdfAssinado = async (req: Request, res: Response) => {
        const anexo = await this.service.adicionarPdfAssinado(
            idParam(req),
            arquivoPdfAssinado(req),
        );
        return res.status(201).json(anexo);
    };

    gerarDocumento = async (req: Request, res: Response) => {
        const id = idParam(req);
        const documento = await this.service.gerarRequerimento(id);
        const requerimento = await this.service.procurarRequerimento(id);
        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        );
        res.setHeader(
            "Content-Disposition",
            `attachment; filename="requerimento-${encodeURIComponent(requerimento.protocolo)}.docx"`,
        );
        return res.send(documento);
    };

    gerarPdf = async (req: Request, res: Response) => {
        const id = idParam(req);
        const documento = await this.service.gerarPdfRequerimento(id);
        const requerimento = await this.service.procurarRequerimento(id);
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
            "Content-Disposition",
            `attachment; filename="requerimento-${encodeURIComponent(requerimento.protocolo)}.pdf"`,
        );
        return res.send(documento);
    };

    deletarRequerimento = async (req: Request, res: Response) => {
        await this.service.deletarRequerimento(idParam(req));
        return res.status(204).end();
    };
}
