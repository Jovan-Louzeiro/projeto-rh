import type { Request, Response } from "express";
import { CRUDServices } from "@/services/crud.service.js";
import { obterUsuario } from "@/middlewares/auth.js";
import { CrudSchemas } from "@/schemas/crud.schemas.js";
import z, { ZodType } from "zod";

export class CrudController<TService extends CRUDServices<any, any>, TSchema extends CrudSchemas> {

    nome: string

    constructor(
        protected readonly service: TService,
        protected schemas: TSchema,
        protected parametro = "id"
    ) {

        this.nome = service.nome
    }

    protected validarParams(parametros: unknown) {
        return z.record(
            z.string(),
            z.coerce
                .number()
                .int("O ID deve ser um número inteiro")
                .positive("O ID deve ser positivo")
        ).parse(parametros);
    }

    protected validarBody<T>(
        schema: z.ZodType<T>,
        dados: unknown
    ): T {
        return schema.parse(dados);
    }

    listar = async (req: Request, res: Response) => {

        const mostrarTudo = req.query.mostrarTudo === "true";

        const resposta = await this.service.listar(mostrarTudo);

        return res.json(resposta);
    }

    procurarContato = async (req: Request, res: Response) => {

        const { id } = this.validarParams(req.params)

        const resposta = await this.service.procurar(id);

        return res.json(resposta);
    }

    adicionar = async (req: Request, res: Response) => {

        const usuario = obterUsuario(req)

        const body = this.validarBody(this.schemas.adicionar, req.body)

        const resposta = await this.service.adicionar(usuario.nome, body);

        return res.status(201).json({
            mensagem: `${this.nome} cadastrado com sucesso`,
            dados: resposta
        });
    }

    atualizar = async (req: Request, res: Response) => {

        const { id } = this.validarParams(req.params)

        const body = this.validarBody(this.schemas.atualizar, req.body)

        const usuario = obterUsuario(req)

        const resposta = await this.service.atualizar(usuario.nome, id, body);

        return res.json({
            mensagem: `${this.nome} atualizado com sucesso`,
            dados: resposta
        });
    }

    deletar = async (req: Request, res: Response) => {

        const {id} = this.validarParams(req.params)

        const usuario = obterUsuario(req)

        const resposta = await this.service.deletar(id, usuario.nome);

        return res.json({
            mensagem: `${this.nome} Excluído com sucesso`,
            dados: resposta
        });
    }

    registrarSchema = (req: Request, res: Response) => {
        const operacao = req.query.operacao;

        if (
            operacao !== "adicionar" &&
            operacao !== "atualizar"
        ) {
            res.status(400).json({
                erro: "A operação deve ser adicionar ou atualizar"
            });
            return;
        }

        const schema =
            operacao === "adicionar"
                ? this.schemas.adicionar
                : this.schemas.atualizar;

        const jsonSchema = z.toJSONSchema(schema, {
            unrepresentable: "any"
        });

        res.json({
            operacao,
            schema: jsonSchema
        });
    };
}