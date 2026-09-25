import { prismaModel, VerificacaoUso } from "../types/dominio.types.js";
import { RegistroEmUso, RegistroJaExistenteError, RegistroNaoEncontradoError } from "../errors/dominios.errors.js";

export class CRUDServices {

    constructor(
        private readonly prismaModel: prismaModel,
        public readonly nome: string,
        private readonly idField: string,
    ) {
    }

    async listar(mostrarTudo?: boolean) {
        if (mostrarTudo) {
            return await this.prismaModel.findMany()
        }

        return await this.prismaModel.findMany({
            where: {
                ativo: true
            }
        })
    }

    async procurar(id: number) {
        const resultado = await this.prismaModel.findUnique({
            where: {
                [this.idField]: id
            }
        })

        if (!resultado) {
            throw new RegistroNaoEncontradoError(this.nome)
        }

        return resultado
    }

    async adicionar(data: { descricao: string, ativo?: boolean }) {

        return await this.prismaModel.create({
            data: {
                descricao: data.descricao,
                ativo: data.ativo ?? true
            }
        })
    }

    async atualizar(id: number, data: { descricao?: string, ativo?: boolean }) {

        const dominio = await this.procurar(id)

        return this.prismaModel.update({
            where: {
                [this.idField]: id
            },
            data: {
                descricao: data.descricao ?? dominio.descricao,
                ativo: data.ativo ?? dominio.ativo
            }
        })

    }

    async deletar(id: number) {
        await this.procurar(id)

        return await this.prismaModel.delete({
            where: {
                [this.idField]: id
            }
        })
    }


}