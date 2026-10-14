import { prisma } from "@/lib/prisma.js";
import type { ServidorCreate, ServidorUpdate } from "@/schemas/servidor.schemas.js";
import { RegistroNaoEncontradoError } from "@/errors/dominios.errors.js";
import { CRUDServices } from "@/services/crud.service.js";

export class ServidorService extends CRUDServices<ServidorCreate, ServidorUpdate>{

    constructor(){
        super(
            prisma.servidor,
            "Servidor",
            "id_servidor"
        )
    }

    async detalhar(id: number){
        const resultado = await this.prismaModel.findUnique({
                    where: {
                        id_servidor: id
                    },
                    include: {
                        certidao: true,
                        cnh: true,
                        ctps: true,
                        identidade: true,
                        titulo_eleitor: true
                    }
                })
        
                if (!resultado) {
                    throw new RegistroNaoEncontradoError(this.nome)
                }
        
                return resultado
    }

    async adicionar(usuario: string, data: ServidorCreate){

        const {
            certidao,
            cnh,
            ctps,
            identidade,
            titulo_eleitor,
            ...dadosServidor
        } = data

        return await this.prismaModel.create({
            data: {
                ...dadosServidor,

                certidao: certidao
                    ? {create: certidao}
                    : undefined,

                cnh: cnh
                    ? {create: cnh}
                    : undefined,

                ctps: ctps
                    ? {create: ctps}
                    : undefined,

                identidade: identidade
                    ? {create: identidade}
                    : undefined,

                titulo_eleitor: titulo_eleitor
                    ? {create: titulo_eleitor}
                    : undefined
            }
        })

    }
}