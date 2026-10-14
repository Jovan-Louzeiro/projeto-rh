import { UsuariosService } from "@/services/usuarios.service.js";
import { CrudController } from "@/controllers/crud.controller.js";

export class UsuariosController extends CrudController{
    constructor(){
        super(
            new UsuariosService()
        )
    }
}