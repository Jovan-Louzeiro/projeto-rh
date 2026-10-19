import { CrudController } from "@/controllers/crud.controller.js";
import { obterUsuario } from "@/middlewares/auth.js";
import { MatriculaCreate, MatriculaSchemas } from "@/schemas/matricula.schemas.js";
import { MatriculaService } from "@/services/matricula.service.js";
import { Request, Response } from "express";

export class MatriculaController extends CrudController<MatriculaService, MatriculaSchemas>{

    constructor(){

        super(
            new MatriculaService(),
            new MatriculaSchemas()
        )

    }

    listarMatriculaPorServidor = async (req: Request, res: Response) => {

        const {idServidor} = this.validarParams(req.params)

        const resposta = await this.service.listarMatriculaPorServidor(idServidor)

        return res.json(resposta)

    }

    procurarMatriculaServidor = async (req: Request, res: Response) => {

        const {idServidor, id} = this.validarParams(req.params)

        const resposta = await this.service.procurarMatriculaServidor(id, idServidor)

        return res.json(resposta)
    }

    adicionarMatricula = async (req: Request, res: Response) => {

        const {idServidor} = this.validarParams(req.params)

        req.body.servidor_id = idServidor

        const data = this.validarBody(this.schemas.adicionar, req.body)

        const usuario = obterUsuario(req)

        const resposta = await this.service.adicionarMatricula(usuario.nome, data)

        return res.status(201).json({
            mensagem: `${this.nome} cadastrado com sucesso`,
            dados: resposta
        });

    }

    atualizarMatricula = async(req: Request, res: Response) => {

        const {idServidor, id} = this.validarParams(req.params)

        req.body.servidor_id = idServidor

        const data = this.validarBody(this.schemas.atualizar, req.body);

        const usuario = obterUsuario(req);

        const resposta = await this.service.atualizarMatricula(usuario.nome, id, data);

        return res.json({
            mensagem: `${this.nome} atualizado com sucesso`,
            dados: resposta
        });
    }

    deletarMatricula = async(req: Request, res: Response) => {

        const {idServidor, id} = this.validarParams(req.params)

        const usuario = obterUsuario(req)

        const resposta = await this.service.deletarMatricula(usuario.nome, idServidor, id)

        return res.json({
            mensagem: `${this.nome} Excluído com sucesso`,
            dados: resposta
        });
    }

}