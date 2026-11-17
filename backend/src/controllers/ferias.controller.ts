import type { Request, Response } from "express";
import {
  feriasCamposSchema,
  feriasIdSchema,
  feriasServidorIdSchema,
} from "@/schemas/ferias.schema.js";
import { FeriasService } from "@/services/ferias.service.js";

export class FeriasController {
  private readonly service = new FeriasService();

  listar = async (_req: Request, res: Response) => {
    res.json(await this.service.listar());
  };

  listarPorServidor = async (req: Request, res: Response) => {
    const { idServidor } = feriasServidorIdSchema.parse(req.params);
    res.json(await this.service.listarPorServidor(idServidor));
  };

  procurar = async (req: Request, res: Response) => {
    const { id } = feriasIdSchema.parse(req.params);
    res.json(await this.service.procurar(id));
  };

  criarParaServidor = async (req: Request, res: Response) => {
    const { idServidor } = feriasServidorIdSchema.parse(req.params);
    const dados = feriasCamposSchema.parse(req.body);
    res.status(201).json(await this.service.criar({ ...dados, servidorId: idServidor }));
  };

  atualizar = async (req: Request, res: Response) => {
    const { id } = feriasIdSchema.parse(req.params);
    const dados = feriasCamposSchema.parse(req.body);
    res.json(await this.service.atualizar(id, dados));
  };

  cancelar = async (req: Request, res: Response) => {
    const { id } = feriasIdSchema.parse(req.params);
    res.json(await this.service.cancelar(id));
  };
}
