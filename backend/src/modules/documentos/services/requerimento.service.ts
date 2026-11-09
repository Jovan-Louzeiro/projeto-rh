import type { Prisma, Requerimento } from "#/generated/prisma/client.js";
import { RequerimentoWhereInput } from "#/generated/prisma/models.js";
import { prisma } from "@/lib/prisma.js";
import { RequerimentoCreate, RequerimentoDadosHistoricos, RequerimentoUpdate } from "@/modules/documentos/schemas/requerimento.schema.js";
import { gerarRequerimento } from "@/modules/documentos/utils/novo_gerarRequerimento.docx.js";
import { CRUDServices } from "@/services/crud.service.js";
import { ServidorService } from "@/services/servidor.service.js";

export class requerimentoService extends CRUDServices<RequerimentoCreate, RequerimentoUpdate>{

    constructor(){

        super(
            prisma.requerimento,
            "Requerimento",
            "id_requerimento"
        )

    }

    private readonly servidorService = new ServidorService()

    async listarRequerimentos({ where }: { where?: RequerimentoWhereInput }) {

        return await this.prismaModel.findMany({
            where: where
        })

    }

    async procurarRequerimento({ id_requerimento }: { id_requerimento: number }) {

        return await this.prismaModel.findUnique({
            where: {
                id_requerimento: id_requerimento
            }
        })

    }

    async contarRequerimentos({ where }: { where: RequerimentoWhereInput }) {

        return await this.prismaModel.count({
            where: where
        })

    }

    async cadastrarRequerimento({ dados }: { dados: RequerimentoCreate }) {

        await this.servidorService.procurar(dados.servidor_id)

        return this.prismaModel.create({
            data: dados
        })


    }

    async deletarRequerimento({ id_requerimento }: { id_requerimento: number }) {

        await this.procurarRequerimento({id_requerimento: id_requerimento})

        return await this.prismaModel.delete({
            where: {
                id_requerimento: id_requerimento
            }
        })

    }

    async gerarRequerimento({id_requerimento}: { id_requerimento: number}){

        const requerimento: Prisma.RequerimentoGetPayload<{}> & {dados_historicos: RequerimentoDadosHistoricos}= await this.procurarRequerimento({id_requerimento: id_requerimento})

        const dados_historicos: RequerimentoDadosHistoricos = requerimento.dados_historicos

        const gerarReq = await gerarRequerimento({
            data: dados_historicos
        })

    }

}