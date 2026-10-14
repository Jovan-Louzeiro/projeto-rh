import { prismaModel } from "@/types/crud.types.js";
import { RegistroNaoEncontradoError } from "@/errors/dominios.errors.js";

export type ParametrosController = {
    procurar?: string;
    atualizar?: string;
    deletar?: string;
} | string;

export class CRUDServices<TCreate, TUpdate> {

    protected readonly idField: Required<Exclude<ParametrosController, string>>;

    constructor(
        protected readonly prismaModel: prismaModel,
        public readonly nome: string,
        parametros: ParametrosController = {}
    ) {

        this.idField = {
            procurar: "id",
            atualizar: "id",
            deletar: "id",
            ...(typeof parametros === "string"
                ? {
                    procurar: parametros,
                    atualizar: parametros,
                    deletar: parametros,
                }
                : parametros),
        }

    }

    async listar(mostrarTudo?: boolean) {
    return await this.prismaModel.findMany({
        where: {
            ...(!mostrarTudo && { ativo: true }),
        }
    });
}

    async procurar(id: number, idField=this.idField.procurar) {
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

    async atualizar(usuario: string, id: number, data: TUpdate, idField=this.idField.atualizar) {

        await this.procurar(id, idField)

        console.log(`${this.nome} id:${id} foi atualizado por ${usuario}`)

        return this.prismaModel.update({
            where: {
                [idField]: id
            },
            data: data
        })

    }

    async deletar(id: number, usuario: string, idField=this.idField.deletar) {
        await this.procurar(id)

        console.log(`${this.nome} id:${id} foi apagado por ${usuario}`)

        return await this.prismaModel.delete({
            where: {
                [idField]: id
            }
        })
    }


}