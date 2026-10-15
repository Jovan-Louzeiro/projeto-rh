import { UsuariosService } from "@/services/usuarios.service.js";
import { CrudController } from "@/controllers/crud.controller.js";
import { UsuariosSchemas } from "@/schemas/usuario.schema.js";

export class UsuariosController extends CrudController<UsuariosService, UsuariosSchemas>{
    constructor(){
        super(
            new UsuariosService(),
            new UsuariosSchemas()
        )
    }
}