import type { Request, Response } from "express";
import { CrudController } from "@/controllers/crud.controller.js";
import type { ParametrosController } from "@/controllers/crud.controller.js";
import { obterUsuario } from "@/middlewares/auth.js";
import { CRUDServices } from "@/services/crud.service.js";

export class RegistrosServidorController<
    TService extends CRUDServices<any, any>
> extends CrudController<TService> {

    constructor(
        registroServidorService: TService,
        parametroId?: ParametrosController
    ) {
        super(
            registroServidorService,
            parametroId
        );
    }

    adicionar = async (req: Request, res: Response) => {
        const body = req.body;
        body.servidor_id = Number(req.params.idServidor);

        const usuario = obterUsuario(req);

        const resposta = await this.service.adicionar(
            usuario.nome,
            body
        );

        return res.status(201).json({
            mensagem: `${this.nome} cadastrado com sucesso`,
            dados: resposta,
        });
    };
}