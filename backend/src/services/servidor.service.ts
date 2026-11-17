import { prisma } from "@/lib/prisma.js";
import type { ServidorCreate, ServidorUpdate } from "@/schemas/servidor.schemas.js";
import {
    RegistroJaExistenteError,
    RegistroNaoEncontradoError
} from "@/errors/dominios.errors.js";
import { CRUDServices } from "@/services/crud.service.js";
import { includes, string } from "zod";
import { Prisma } from "#/generated/prisma/client.js";
import { TipoDocumentoDigitalizado } from "#/generated/prisma/enums.js";

export type ArquivoServidorDigitalizado = {
    tipo: TipoDocumentoDigitalizado
    nome: string
    mime_type: string
    tamanho: number
    conteudo: Uint8Array<ArrayBuffer>
}

interface Filtros {

    servidorFiltro?: Prisma.ServidorWhereInput
    matriculasFiltro?: Prisma.MatriculaWhereInput,
    historicosFuncionaisFiltro?: Prisma.HistoricoFuncionalWhereInput

}

export class ServidorService extends CRUDServices<ServidorCreate, ServidorUpdate> {

    constructor() {
        super(
            prisma.servidor,
            "Servidor",
            "id_servidor"
        )

    }

    private async obterWhere({
        filtros
    }: {
        filtros?: Filtros
    }) {

        const { matriculasFiltro, historicosFuncionaisFiltro, servidorFiltro } = filtros ?? {}

        const where: Prisma.ServidorWhereInput = {

            ...servidorFiltro,

            ...(matriculasFiltro || historicosFuncionaisFiltro

                ? {

                    matriculas: {

                        some: {

                            ...matriculasFiltro,

                            ...(historicosFuncionaisFiltro
                                ? {

                                    historicos_funcionais: {

                                        some: historicosFuncionaisFiltro
                                    }
                                } : {})

                        }
                    }
                }
                : {})

        }

        return where
    }

    async listarServidores({
        filtros,
        camposSelect
    }: {
        filtros?: {

            servidorFiltro?: Prisma.ServidorWhereInput
            matriculasFiltro?: Prisma.MatriculaWhereInput,
            historicosFuncionaisFiltro?: Prisma.HistoricoFuncionalWhereInput

        },
        camposSelect?: {

            servidorSelect?: (keyof Prisma.ServidorSelect)[],
            matriculasSelect?: (keyof Prisma.MatriculaSelect)[],
            historicosFuncionaisSelect?: (keyof Prisma.HistoricoFuncionalSelect)[]

        }
    }) {

        const where = await this.obterWhere({ filtros })

        const selectFormatado: {

            servidorSelect?: Prisma.ServidorSelect,
            matriculasSelect?: Prisma.MatriculaSelect,
            historicosFuncionaisSelect?: Prisma.HistoricoFuncionalSelect

        } = camposSelect ? {

            servidorSelect: camposSelect.servidorSelect ? Object.fromEntries(
                camposSelect.servidorSelect.map((campo: string) => [campo, true])
            ) : undefined,

            matriculasSelect: camposSelect.matriculasSelect ? Object.fromEntries(
                camposSelect.matriculasSelect.map((campo: string) => [campo, true])
            ) : undefined,

            historicosFuncionaisSelect: camposSelect.historicosFuncionaisSelect ? Object.fromEntries(
                camposSelect.historicosFuncionaisSelect.map((campo: string) => [campo, true])
            ) : undefined

        } : {}

        if (selectFormatado.servidorSelect?.usuario) {

            selectFormatado.servidorSelect.usuario = {
                omit: {
                    senha: true
                }
            }
        }

        const select: Prisma.ServidorSelect = {

            ...selectFormatado.servidorSelect,


            ...(selectFormatado.matriculasSelect || selectFormatado.historicosFuncionaisSelect
                ? {
                    matriculas: {
                        select: {
                            ...selectFormatado.matriculasSelect,

                            ...(selectFormatado.historicosFuncionaisSelect
                                ? {
                                    historicos_funcionais: {
                                        select: selectFormatado.historicosFuncionaisSelect
                                    }
                                } : {})
                        }
                    }

                } : {})



        }

        console.log(Object.keys(select).length)

        const resultados = this.prismaModel.findMany({
            where: where,
            ...(Object.keys(select).length > 0 ? {select} : {})
        })

        return resultados

    }

    async contarServidores({
        filtros
    }: {
        filtros?: Filtros
    }
    ) {

        const where = await this.obterWhere({ filtros })

        const resultado = await this.prismaModel.count({
            where: where
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
                documentos_digitalizados: {
                    select: {
                        tipo: true,
                        nome: true,
                        mime_type: true,
                        tamanho: true,
                        enviado_em: true,
                    },
                },
                municipio_endereco: true,
                matriculas: {
                    include: {
                        historicos_funcionais: {
                            orderBy: { data_inicio: "desc" },
                            include: {
                                cargo: true,
                                funcao: true,
                                departamento: true,
                                situacao: true,
                            },
                        },
                    },
                },
            }
        })

        if (!resultado) {
            throw new RegistroNaoEncontradoError(this.nome)
        }

        return resultado
    }

    async adicionar(
        usuario: string,
        data: ServidorCreate,
        arquivosDigitalizados: ArquivoServidorDigitalizado[] = []
    ) {
        if (!(await this.cpfDisponivel(data.cpf))) {
            throw new RegistroJaExistenteError("CPF")
        }

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
                    : undefined,

                documentos_digitalizados: arquivosDigitalizados.length
                    ? { create: arquivosDigitalizados }
                    : undefined
            },
            include: {
                certidao: true,
                cnh: true,
                ctps: true,
                identidade: true,
                titulo_eleitor: true,
                contatos: true,
                documentos_digitalizados: {
                    select: {
                        tipo: true,
                        nome: true,
                        mime_type: true,
                        tamanho: true,
                        enviado_em: true,
                    },
                },
                matriculas: {
                    include: {
                        historicos_funcionais: true
                    }
                }
            }
        })

    }

    async cpfDisponivel(cpf: string): Promise<boolean> {
        const servidor = await prisma.servidor.findUnique({
            where: { cpf },
            select: { id_servidor: true },
        })

        return !servidor
    }

    async salvarDocumentoDigitalizado(
        servidorId: number,
        tipo: TipoDocumentoDigitalizado,
        arquivo: Omit<ArquivoServidorDigitalizado, "tipo">
    ) {
        return prisma.documentoDigitalizadoServidor.upsert({
            where: {
                servidor_id_tipo: {
                    servidor_id: servidorId,
                    tipo,
                },
            },
            create: {
                servidor_id: servidorId,
                tipo,
                ...arquivo,
            },
            update: arquivo,
            select: {
                tipo: true,
                nome: true,
                mime_type: true,
                tamanho: true,
                enviado_em: true,
            },
        })
    }

    async obterDocumentoDigitalizado(servidorId: number, tipo: TipoDocumentoDigitalizado) {
        return prisma.documentoDigitalizadoServidor.findUnique({
            where: {
                servidor_id_tipo: {
                    servidor_id: servidorId,
                    tipo,
                },
            },
            select: {
                nome: true,
                mime_type: true,
                tamanho: true,
                conteudo: true,
            },
        })
    }

    async removerDocumentoDigitalizado(servidorId: number, tipo: TipoDocumentoDigitalizado) {
        return prisma.documentoDigitalizadoServidor.deleteMany({
            where: {
                servidor_id: servidorId,
                tipo,
            },
        })
    }
}