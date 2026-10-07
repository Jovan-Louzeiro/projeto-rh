import z from "zod";
import { prisma } from "../lib/prisma.js";
import { DocumentosServices } from "./documentos/documentos.service.js";
import { ServidorSchemas } from "../schemas/servidor.schemas.js";

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