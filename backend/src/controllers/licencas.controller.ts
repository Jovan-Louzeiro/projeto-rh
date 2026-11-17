import type { Request, Response } from "express";
import {
  licencaCamposSchema,
  licencaIdSchema,
  licencaServidorIdSchema,
} from "@/schemas/licencas.schema.js";
import { LicencasService } from "@/services/licencas.service.js";

export class LicencasController {
  private readonly service = new LicencasService();

  listar = async (_req: Request, res: Response) => {
    res.json(await this.service.listar());
  };

  procurar = async (req: Request, res: Response) => {
    const { id } = licencaIdSchema.parse(req.params);
    res.json(await this.service.procurar(id));
  };

  listarPorServidor = async (req: Request, res: Response) => {
    const { idServidor } = licencaServidorIdSchema.parse(req.params);
    res.json(await this.service.listarPorServidor(idServidor));
  };

  criarParaServidor = async (req: Request, res: Response) => {
    const { idServidor } = licencaServidorIdSchema.parse(req.params);
    const dados = licencaCamposSchema.parse(req.body);
    res.status(201).json(await this.service.criar({ ...dados, servidorId: idServidor }, req.file));
  };

  atualizar = async (req: Request, res: Response) => {
    const { id } = licencaIdSchema.parse(req.params);
    const dados = licencaCamposSchema.parse(req.body);
    res.json(await this.service.atualizar(id, dados, req.file));
  };

  cancelar = async (req: Request, res: Response) => {
    const { id } = licencaIdSchema.parse(req.params);
    res.json(await this.service.cancelar(id));
  };

  baixarDocumento = async (req: Request, res: Response) => {
    const { id } = licencaIdSchema.parse(req.params);
    const arquivo = await this.service.baixarDocumento(id);
    res.setHeader("Content-Type", arquivo.tipo);
    res.setHeader("Content-Disposition", `attachment; filename*=UTF-8''${encodeURIComponent(arquivo.nome)}`);
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.send(arquivo.conteudo);
  };
}
