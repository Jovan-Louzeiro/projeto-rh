import { omit } from "zod/mini";
import { prisma } from "../lib/prisma.js";
import { CRUDServices } from "./crud.service.js";
import { RegistroNaoEncontradoError } from "../errors/dominios.errors.js";

export class UsuariosService<TCreate, TUpdate> extends CRUDServices<TCreate, TUpdate> {
    constructor() {
        super(
            prisma.usuario,
            "Usuário",
            "id_usuario"
        )
    }

    async listar() {
        return await this.prismaModel.findMany({
            where: {
                ativo: true
            },
            omit: {
                senha: true
            }
        })
    }

    async procurar(id: number) {
        const resultado = await this.prismaModel.findUnique({
            where: {
                id_usuario: id
            },
            omit: {
                senha: true
            }
        })

        if (!resultado) {
            throw new RegistroNaoEncontradoError(this.nome)
        }

        return resultado
    }
}