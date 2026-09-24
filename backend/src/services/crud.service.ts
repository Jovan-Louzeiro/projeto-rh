import { prismaModel, VerificacaoUso } from "../types/dominio.types.js";
import { RegistroEmUso, RegistroJaExistenteError, RegistroNaoEncontradoError } from "../errors/dominios.errors.js";

export class CRUDServices {

    constructor(
        private readonly prismaModel: prismaModel,
        private readonly config: {
            nome: string,
            idField: string,
            verificacoesUso?: VerificacaoUso[]
        }
    ) {}

    async listar(mostrarTudo?: boolean) {
        if(mostrarTudo){
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
                [this.config.idField]: id
            }
        })

        if (!resultado) {
            throw new RegistroNaoEncontradoError(this.config.nome)
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
                [this.config.idField]: id
            },
            data: {
                descricao: data.descricao ?? dominio.descricao,
                ativo: data.ativo ?? dominio.ativo
            }
        })

    }

    async deletar(id: number) {
        await this.procurar(id)

        if (this.config.verificacoesUso?.length){

            const usos = await Promise.all(
                this.config.verificacoesUso.map(
                    async (verificacao) => ({
                        nome: verificacao.nome,
                        quantidade:
                            await verificacao.verificar(id)
                    })
                )
            );
            
            const usosEncontrados = usos.filter(
                (uso) => uso.quantidade > 0
            );
            
            if (usosEncontrados.length > 0){
                const total = usosEncontrados.reduce( (soma, uso) => soma + uso.quantidade, 0 );

                throw new RegistroEmUso( this.config.nome, total );
            }
        }


        return await this.prismaModel.delete({
            where: {
                [this.config.idField]: id
            }
        })
    }

    
}