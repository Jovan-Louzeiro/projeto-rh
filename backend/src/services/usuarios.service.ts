import { omit } from "zod/mini";
import { prisma } from "@/lib/prisma.js";
import { CRUDServices } from "@/services/crud.service.js";
import { RegistroNaoEncontradoError } from "@/errors/dominios.errors.js";
import type { UsuarioCreate, UsuarioUpdate } from "@/schemas/usuario.schema.js";
import { gerarHash } from "@/utils/senha.js";
import { constructFromSymbol } from "date-fns/constants";

export class UsuariosService extends CRUDServices<UsuarioCreate, UsuarioUpdate> {
    constructor() {
        super(
            prisma.usuario,
            "Usuário",
            "id_usuario"
        )
    }

    async listar() {
        return await this.prismaModel.findMany({
            where: {
                ativo: true
            },
            omit: {
                senha: true
            }
        })
    }

    async procurar(id: number) {
        const resultado = await this.prismaModel.findUnique({
            where: {
                id_usuario: id
            },
            omit: {
                senha: true
            }
        })

        if (!resultado) {
            throw new RegistroNaoEncontradoError(this.nome)
        }

        return resultado
    }

    async atualizar(usuario: string, id: number, data: UsuarioUpdate) {

        if(data.senha){

            data.senha = await gerarHash(data.senha)

        }

        console.log(`${this.nome} id:${id} foi atualizado por ${usuario}`)

        return await this.prismaModel.update({
            where: {
                id_usuario: id
            },
            data: data,
            omit:{
                senha: true
            }
        })
    }

    async adicionar(usuario: string, data: UsuarioCreate){        
       
        data.senha = await gerarHash(data.senha)

        return super.adicionar(usuario, data)

    }

}