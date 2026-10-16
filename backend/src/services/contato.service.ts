import { RegistroNaoEncontradoError } from "@/errors/dominios.errors.js";
import { prisma } from "@/lib/prisma.js";
import { ContatoCreate, ContatoUpdate } from "@/schemas/contato.schemas.js";
import { CRUDServices } from "@/services/crud.service.js";
import { ServidorService } from "@/services/servidor.service.js";

export class ContatoService<ContatoCreate extends { servidor_id: number }, ContatoUpdate extends { servidor_id: number }> extends CRUDServices<ContatoCreate, ContatoUpdate> {

    private readonly servidorService

    constructor() {
        super(
            prisma.contato,
            "Contato",
            "id_contato"
        )

        this.servidorService = new ServidorService()
    }


    async listarPorServidor(id_usuario: number) {

        return this.prismaModel.findMany({
            where: {
                servidor_id: id_usuario
            }
        })

    }

    async procurarContato(servidor_id: number, id_contato: number) {

        await this.servidorService.procurar(servidor_id);

        const contato = await this.prismaModel.findFirst({
            where: {
                id_contato,
                servidor_id
            }
        });

        if (!contato) {
            throw new RegistroNaoEncontradoError("Contato");
        }

        return contato;

    }

    async adicionar(usuario: string, data: ContatoCreate) {

        await this.servidorService.procurar(data.servidor_id)

        return super.adicionar(usuario, data)

    }

    async atualizar(usuario: string, id: number, data: ContatoUpdate) {

        await this.servidorService.procurar(data.servidor_id)

        return super.atualizar(usuario, id, data)
    }

    async deletarContato(servidor_id: number, id_contato: number, usuario: string, idField?: string) {

        await this.servidorService.procurar(servidor_id)

        return super.deletar(id_contato, usuario)
    }
}