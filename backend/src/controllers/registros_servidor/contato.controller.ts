import { RegistrosServidorController } from "@/controllers/registros_servidor/registrosServidor.controller.js";
import { obterUsuario } from "@/middlewares/auth.js";
import { ContatoService } from "@/services/registros_servidor/contato.service.js";
import { Request, Response } from "express";
import { number } from "zod";

export class ContatoController extends RegistrosServidorController<ContatoService<any, any>> {

    constructor() {
        super(
            new ContatoService(),
            {
                procurar: "id",
                atualizar: "id",
                deletar: "id",
            }
        );
    }

    listarPorUsuario = async (req: Request, res: Response) => {
        const id_servidor = Number(req.params.idServidor);

        const resposta =
            await this.service.listarPorUsuario(id_servidor);

        return res.json(resposta);
    };
}