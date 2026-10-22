import { prisma } from "@/lib/prisma.js";
import type { ServidorCreate, ServidorUpdate } from "@/schemas/servidor.schemas.js";
import { RegistroNaoEncontradoError } from "@/errors/dominios.errors.js";
import { CRUDServices } from "@/services/crud.service.js";
import { includes, string } from "zod";
import { Prisma } from "#/generated/prisma/client.js";

export class ServidorService extends CRUDServices<ServidorCreate, ServidorUpdate> {

    constructor() {
        super(
            prisma.servidor,
            "Servidor",
            "id_servidor"
        )
    }

    async listarServidores({
        filtros,
        camposSelect
    }: {
        filtros?: Prisma.ServidorWhereInput,
        camposSelect?: string[]
    }){

        const select = camposSelect?
            Object.fromEntries(
                camposSelect.map((campo: string) => [campo, true])
            ) : undefined

        const pesquisa: {
            where: Prisma.ServidorWhereInput,
            select?: Prisma.ServidorSelect,
        } = {

            where: filtros ?? {}

        }

        if(select){

            pesquisa.select = select

        }

        console.log(pesquisa)
        
        const resultados = this.prismaModel.findMany(pesquisa)

        return resultados

    }

    async contarServidoresAtivos() {

        const resultado = await prisma.servidor.count({
            where: {
                ativo: true
            }
        })

        return resultado
    }

    async detalharServidor(id: number) {
        const resultado = await this.prismaModel.findUnique({
            where: {
                id_servidor: id
            },
            include: {
                certidao: true,
                cnh: true,
                ctps: true,
                identidade: true,
                titulo_eleitor: true,
                contatos: true,
                matriculas: true
            }
        })

        if (!resultado) {
            throw new RegistroNaoEncontradoError(this.nome)
        }

        return resultado
    }

    async adicionar(usuario: string, data: ServidorCreate) {

        const {
            certidao,
            cnh,
            ctps,
            identidade,
            titulo_eleitor,
            contatos,
            matriculas,
            ...dadosServidor
        } = data

        const matriculasFormatadas = matriculas?.map(matricula => {

            const { historicos_funcionais, ...dadosMatricula } = matricula

            return {
                ...dadosMatricula,

                historicos_funcionais: historicos_funcionais
                    ? { create: historicos_funcionais }
                    : undefined
            }

        })

        return await this.prismaModel.create({
            data: {
                ...dadosServidor,

                certidao: certidao
                    ? { create: certidao }
                    : undefined,

                cnh: cnh
                    ? { create: cnh }
                    : undefined,

                ctps: ctps
                    ? { create: ctps }
                    : undefined,

                identidade: identidade
                    ? { create: identidade }
                    : undefined,

                titulo_eleitor: titulo_eleitor
                    ? { create: titulo_eleitor }
                    : undefined,

                contatos: contatos
                    ? { create: contatos }
                    : undefined,
                
                matriculas: matriculasFormatadas
                    ? { create: matriculasFormatadas }
                    : undefined
            },
            include: {
                certidao: true,
                cnh: true,
                ctps: true,
                identidade: true,
                titulo_eleitor: true,
                contatos: true,
                matriculas: true
            }
        })

    }
}