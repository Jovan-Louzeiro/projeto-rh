import z, { includes } from "zod";
import { prisma } from "../lib/prisma.js";
import { DocumentosServices } from "./documentos/documentos.service.js";
import { ServidorSchemas } from "../schemas/servidor.schemas.js";
import { RegistroNaoEncontradoError } from "../errors/dominios.errors.js";

type ServidorAdicionar = z.infer<ServidorSchemas["adicionar"]>;

type ServidorAtualizar = z.infer<ServidorSchemas["atualizar"]>;

export class ServidorService extends DocumentosServices<ServidorAdicionar, ServidorAtualizar>{

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
                        [this.idField]: id
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

    async adicionar(data: ServidorAdicionar){

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