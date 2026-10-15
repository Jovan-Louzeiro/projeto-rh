import { UsuariosController } from "@/controllers/usuarios.controller.js";
import { UsuariosSchemas } from "@/schemas/usuario.schema.js";
import { CrudRoutes } from "@/routes/crud.routes.js";

export class UsuariosRouter extends CrudRoutes<UsuariosController>{
    constructor(){
        super(
            new UsuariosController()
        )

        this.registrarSchema()
        this.registrarRotasCrud()
        
    }
}