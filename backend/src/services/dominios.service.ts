import { prisma } from "../lib/prisma.js";
import { RegistroEmUso, RegistroJaExistenteError, RegistroNaoEncontradoError } from "../errors/dominios.errors.js";

type prismaModel = {
    findMany: Function;
    findUnique: Function;
    findFirst: Function;
    create: Function;
    update: Function;
    delete: Function;
}

type verificacoesUso ={
    nome: string,
    verificar: (id: number) => Promise<number>
}

type opcoesDominio ={
    nome: string,
    idField: string,
    verificacoesUso : verificacoesUso[]
}

export class Dominio {

    constructor(
        private readonly prismaModel: prismaModel,
        private readonly opcoes: opcoesDominio
    ) {}

    async listar() {
        return await this.prismaModel.findMany()
    }

    async procurar(id: number) {
        const resultado = await this.prismaModel.findUnique({
            where: {
                [this.opcoes.idField]: id
            }
        })

        if (!resultado) {
            throw new RegistroNaoEncontradoError(this.opcoes.nome)
        }

        return resultado
    }

    async adicionar(data: { descricao: string, ativo?: boolean }) {
        const dominioExiste = await this.prismaModel.findUnique({
            where: {
                descricao: data.descricao
            }
        })

        if (dominioExiste) {
            throw new RegistroJaExistenteError(this.opcoes.nome)
        }

        return await this.prismaModel.create({
            data: {
                descricao: data.descricao,
                ativo: data.ativo ?? true
            }
        })
    }
    
    async atualizar(id: number, data: { descricao?: string, ativo?: boolean }) {

        const dominio = await this.procurar(id)

        if (data.descricao) {
            const descricaoExiste = await this.prismaModel.findFirst({
                where: {
                    descricao: data.descricao,
                    NOT: {
                        [this.opcoes.idField]: id
                    }
                }
            })

            if (descricaoExiste) {
                throw new RegistroJaExistenteError(this.opcoes.nome)
            }
        }

        return this.prismaModel.update({
            where: {
                [this.opcoes.idField]: id
            },
            data: {
                descricao: data.descricao ?? dominio.descricao,
                ativo: data.ativo ?? dominio.ativo
            }
        })

    }

    async deletar(id: number) {
        await this.procurar(id)

        if (this.opcoes.verificacoesUso?.length){

            const usos = await Promise.all(
                this.opcoes.verificacoesUso.map(
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

                throw new RegistroEmUso( this.opcoes.nome, total );
            }
        }


        return await this.prismaModel.delete({
            where: {
                [this.opcoes.idField]: id
            }
        })
    }

    
}