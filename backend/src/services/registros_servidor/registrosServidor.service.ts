import { prismaModel } from "@/types/crud.types.js";
import { CRUDServices, ParametrosController } from "@/services/crud.service.js";

import { ServidorService } from "@/services/servidor.service.js";

type RegistroServidor = {
    servidor_id: number;
};

type RegistroServidorCreate<T> = T & RegistroServidor;
type RegistroServidorUpdate<T> = T & RegistroServidor;

export class RegistrosServidorServices<TCreate, TUpdate> extends CRUDServices<TCreate, TUpdate>{

    constructor(
        prismaModel: prismaModel,
        nome: string,
        parametros?: ParametrosController | string
    ){
        super(
            prismaModel,
            nome,
            parametros
        )
    }

    async adicionar(usuario: string, data: RegistroServidorCreate<TCreate>) {

        await new ServidorService().procurar(data.servidor_id, "id_servidor");

        return super.adicionar(usuario, data);
    }

    async listarPorServidor(id_servidor: number){

        await new ServidorService().procurar(id_servidor, "id_servidor");

        return await this.prismaModel.findMany({
            where: {
                servidor_id: id_servidor
            }
        })

    }

}