import { UsuariosController } from "@/controllers/usuarios.controller.js";
import { UsuariosSchemas } from "@/schemas/usuario.schema.js";
import { CrudRoutes } from "@/routes/crud.routes.js";
import { PermissaoUsuario } from "#/generated/prisma/enums.js";

export class UsuariosRouter extends CrudRoutes<UsuariosController>{
    constructor(){
        super(
            new UsuariosController(),
            {
                adicionar: [PermissaoUsuario.ADMIN],
                atualizar: [PermissaoUsuario.ADMIN],
                deletar: [PermissaoUsuario.ADMIN],
            }
        )

        this.registrarSchema()
        this.registrarRotasCrud()
        
    }
}