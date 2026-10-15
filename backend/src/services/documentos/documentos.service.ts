
import { prismaModel } from "@/types/crud.types.js";
import { CRUDServices } from "@/services/crud.service.js";
import { ServidorService } from "@/services/servidor.service.js";
import { RegistroJaExistenteError, RegistroNaoEncontradoError } from "@/errors/dominios.errors.js";

export class DocumentosServices<TDocumentosCreate extends { servidor_id: number }, TDocumentosUpdate extends { servidor_id: number }> extends CRUDServices<TDocumentosCreate, TDocumentosUpdate> {

    private readonly servidorService

    constructor(prismaModel: prismaModel, nome: string) {
        super(
            prismaModel, nome,
            "servidor_id"
        );

        this.servidorService = new ServidorService()
    }

    async procurar(id_servidor: number){

        await this.servidorService.procurar(id_servidor)

        return super.procurar(id_servidor)
    }

    async adicionar(usuario: string, data: TDocumentosCreate){

        
        const servidorExiste = await this.servidorService.procurar(data.servidor_id)

        if(!servidorExiste){
            throw new RegistroNaoEncontradoError("Servidor")
        }

        const documentoExistente = await this.prismaModel.findUnique({
            where: {
                servidor_id: data.servidor_id
            }
        })

        if(documentoExistente){
            throw new RegistroJaExistenteError(this.nome)
        }

        return super.adicionar(usuario, data)
    }

    async atualizar(usuario: string, id: number, data: TDocumentosUpdate){
        
        const servidorExiste = await this.servidorService.procurar(data.servidor_id)

        if(!servidorExiste){
            throw new RegistroNaoEncontradoError("Servidor")
        }


        return super.atualizar(usuario, id, data)

    }


    async deletar(id_servidor: number, usuario: string){

        await this.servidorService.procurar(id_servidor)

        return super.deletar(id_servidor, usuario)
    }

}
