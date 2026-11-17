import type { Request, Response } from "express";
import {
  quinquenioCamposSchema,
  quinquenioIdSchema,
  quinquenioSchema,
} from "@/schemas/quinquenios.schema.js";
import { QuinqueniosService } from "@/services/quinquenios.service.js";
import { obterDadosFormulario } from "@/utils/dados-formulario.js";

export class QuinqueniosController {
  private readonly service = new QuinqueniosService();

  listar = async (_req: Request, res: Response) => {
    res.json(await this.service.listar());
  };

  procurar = async (req: Request, res: Response) => {
    const { id } = quinquenioIdSchema.parse(req.params);
    res.json(await this.service.procurar(id));
  };

  criar = async (req: Request, res: Response) => {
    const dados = quinquenioSchema.parse(obterDadosFormulario(req));
    res.status(201).json(await this.service.criar(dados, req.file));
  };

  atualizar = async (req: Request, res: Response) => {
    const { id } = quinquenioIdSchema.parse(req.params);
    const dados = quinquenioCamposSchema.parse(obterDadosFormulario(req));
    res.json(await this.service.atualizar(id, dados, req.file));
  };

  cancelar = async (req: Request, res: Response) => {
    const { id } = quinquenioIdSchema.parse(req.params);
    res.json(await this.service.cancelar(id));
  };

  baixarDocumento = async (req: Request, res: Response) => {
    const { id } = quinquenioIdSchema.parse(req.params);
    const arquivo = await this.service.baixarDocumento(id);
    res.setHeader("Content-Type", arquivo.tipo);
    res.setHeader("Content-Disposition", `attachment; filename*=UTF-8''${encodeURIComponent(arquivo.nome)}`);
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.send(arquivo.conteudo);
  };
}
