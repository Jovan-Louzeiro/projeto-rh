import { RegistrosServidorController } from "@/controllers/registros_servidor/registrosServidor.controller.js";
import { ContatoService } from "@/services/registros_servidor/contato.service.js";
import type { Request, Response } from "express";
import type { ContatoCreate, ContatoUpdate } from "@/schemas/registros_servidor/contato.schemas.js";

export class ContatoController extends RegistrosServidorController<
    ContatoService<ContatoCreate, ContatoUpdate>
> {

    constructor() {
        super(
            new ContatoService<ContatoCreate, ContatoUpdate>(),
            "id"
        );
    }

    listarPorUsuario = async (req: Request, res: Response) => {
        const id_servidor = Number(req.params.idServidor);

        const resposta =
            await this.service.listarPorServidor(id_servidor);

        return res.json(resposta);
    };
}