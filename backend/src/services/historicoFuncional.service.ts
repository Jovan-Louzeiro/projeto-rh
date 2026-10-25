import { Prisma } from "#/generated/prisma/client.js";
import { RegistroNaoEncontradoError } from "@/errors/dominios.errors.js";
import { prisma } from "@/lib/prisma.js";
import { HistoricoFuncionalCreate, HistoricoFuncionalUpdate } from "@/schemas/historicoFuncional.schema.js";
import { CRUDServices } from "@/services/crud.service.js";
import { MatriculaService } from "@/services/matricula.service.js";

export class HistoricoFuncionalSevice extends CRUDServices<
    HistoricoFuncionalCreate,
    HistoricoFuncionalUpdate
>{
    
    constructor(){

        super(
            prisma.historicoFuncional,
            "Historico Funcional",
            "id_historico_funcional"
        )

    }

    private matriculaService = new MatriculaService()

    async listarHistoricoFuncionalPorMatricula(servidor_id: number, matricula_id: number, where?: Prisma.HistoricoFuncionalWhereInput, select?: Prisma.HistoricoFuncionalSelect){

        await this.matriculaService.procurarMatriculaServidor(matricula_id, servidor_id)

        return this.prismaModel.findMany({
            where: {
                matricula_id: matricula_id,

                ...(where ?? undefined)
            },

            ...(select ? {select}: undefined)
        })

    }

    async procurarHistoricoFuncionalServidor(servidor_id: number, matricula_id: number, id_historico_funcional: number, select?: Prisma.HistoricoFuncionalSelect){

        await this.matriculaService.procurarMatriculaServidor(matricula_id, servidor_id)

        const historicoFuncional = await this.prismaModel.findUnique({

            where:{
                id_historico_funcional: id_historico_funcional,
                matricula_id: matricula_id
            },

            ...(select ? {select} : undefined)

        })

        if(!historicoFuncional){
            throw new RegistroNaoEncontradoError("Histórico Funcional")
        }

        return historicoFuncional
    }

    async adicionarHistoricoFuncional(usuario: string, servidor_id: number, data: HistoricoFuncionalCreate){

        await this.matriculaService.procurarMatriculaServidor(data.matricula_id, servidor_id)

        return super.adicionar(usuario, data)

    }

    async atualizarHistoricoFuncional(usuario: string, servidor_id: number, matricula_id: number, id_historico_funcional: number, data: HistoricoFuncionalUpdate){

        await this.matriculaService.procurarMatriculaServidor(matricula_id, servidor_id)

        return super.atualizar(usuario, id_historico_funcional, data)

    }

    async deletarHistoricoFuncional(usuario: string, servidor_id: number, matricula_id: number, id_historico_funcional: number){

        await this.matriculaService.procurarMatriculaServidor(matricula_id, servidor_id)

        return super.deletar(id_historico_funcional, usuario)
    }



}