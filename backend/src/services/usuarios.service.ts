import { omit } from "zod/mini";
import { prisma } from "../lib/prisma.js";
import { CRUDServices } from "./crud.service.js";
import { RegistroNaoEncontradoError } from "../errors/dominios.errors.js";
import { UsuarioCreate, UsuarioUpdate } from "../schemas/usuario.schema.js";
import { gerarHash } from "../utils/senha.js";
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

    async atualizar(id: number, data: UsuarioUpdate) {

        if(data.senha){

            data.senha = await gerarHash(data.senha)

        }

        return super.atualizar(id, data)
    }

    async adicionar(data: { nome: string | undefined; email: string | undefined; senha: string | undefined; permissao: "ADMIN" | "RH"; ativo?: boolean | undefined; }): Promise<any> {        
       
        if(data.senha){

            data.senha = await gerarHash(data.senha)

        }

        return super.adicionar(data)

    }

}