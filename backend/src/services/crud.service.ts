import { prismaModel } from "../types/crud.types.js";
import { RegistroNaoEncontradoError } from "../errors/dominios.errors.js";

export class CRUDServices<TCreate, TUpdate> {

    constructor(
        protected readonly prismaModel: prismaModel,
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

    async adicionar(data: TCreate) {

        return await this.prismaModel.create({
            data: data
        })
    }

    async atualizar(id: number, data: TUpdate) {

        await this.procurar(id)

        return this.prismaModel.update({
            where: {
                [this.idField]: id
            },
            data: data
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