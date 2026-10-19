import { prismaModel } from "@/types/crud.types.js";
import { RegistroNaoEncontradoError } from "@/errors/dominios.errors.js";


export class CRUDServices<TCreate, TUpdate> {

    constructor(
        protected readonly prismaModel: prismaModel,
        public readonly nome: string,
        protected idField: string
    ) {

    }

    async listar(mostrarTudo?: boolean, idField=this.idField) {
    return await this.prismaModel.findMany({
        where: {
            ...(!mostrarTudo && { ativo: true }),
        },
        orderBy: [
            { [idField]: "asc" }
        ]
    });
}

    async procurar(id: number, idField=this.idField) {
        const resultado = await this.prismaModel.findUnique({
            where: {
                [idField]: id
            }
        })

        if (!resultado) {
            throw new RegistroNaoEncontradoError(this.nome)
        }

        return resultado
    }

    async adicionar(usuario: string, data: TCreate) {

        console.log(`Um novo ${this.nome} foi adicionado por ${usuario}`)

        return await this.prismaModel.create({
            data: data
        })
    }

    async atualizar(usuario: string, id: number, data: TUpdate, idField=this.idField) {

        await this.procurar(id, idField)

        console.log(`${this.nome} id:${id} foi atualizado por ${usuario}`)

        return await this.prismaModel.update({
            where: {
                [idField]: id
            },
            data: data
        })

    }

    async deletar(id: number, usuario: string, idField=this.idField) {

        await this.procurar(id)

        console.log(`${this.nome} id:${id} foi apagado por ${usuario}`)

        return await this.prismaModel.delete({
            where: {
                [idField]: id
            }
        })
    }


}