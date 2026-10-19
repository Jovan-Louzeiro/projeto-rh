import { prisma } from "@/lib/prisma.js";
import { MatriculaCreate, MatriculaUpdate } from "@/schemas/matricula.schemas.js";
import { CRUDServices } from "@/services/crud.service.js";
import { ServidorService } from "@/services/servidor.service.js";

export class MatriculaService extends CRUDServices<MatriculaCreate, MatriculaUpdate>{
    
    private readonly servidorService

    constructor(){

        super(
            prisma.matricula,
            "Matricula",
            "id_matricula"
        )

        this.servidorService = new ServidorService()

    }

    // lista matriculas de um servidor
    async listarMatriculaPorServidor(servidor_id: number){

        // Verifica a existencia do servidor
        await this.servidorService.procurar(servidor_id)

        return this.prismaModel.findMany({
            
            where: {
                servidor_id: servidor_id
            }

        })

    }

    // procura uma matricula de um servidor
    async procurarMatriculaServidor(id_matricula: number, id_servidor: number){

        await this.servidorService.procurar(id_servidor)

        return super.procurar(id_matricula)
        
    }

    // Cria uma nova Matricula
    async adicionarMatricula(usuario: string, data: MatriculaCreate){
        
        // Procura se o servidor existe
        await this.servidorService.procurar(data.servidor_id)

        return super.adicionar(usuario, data)

    }

    // Atualiza a uma matricula
    async atualizarMatricula(usuario: string, id_matricula: number, data: MatriculaUpdate){
        
        // Procura se o servidor existe
        await this.servidorService.procurar(data.servidor_id)

        return super.atualizar(usuario, id_matricula, data)

    }

    async deletarMatricula(usuario: string, servidor_id: number, id_matricula: number){
        
        // Procura se o servidor existe
        await this.servidorService.procurar(servidor_id)

        return super.deletar(id_matricula, usuario)

    }

}