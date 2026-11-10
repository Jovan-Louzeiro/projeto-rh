import { MunicipioController } from "@/controllers/municipio.controller.js";
import { MunicipioSchema } from "@/schemas/municipio.schema.js";
import { CrudRoutes } from "@/routes/crud.routes.js";
import { autorizacoesCadastroRh } from "@/types/crud.types.js";

export class MunicipioRouter extends CrudRoutes<MunicipioController>{
    constructor(){
        super(
            new MunicipioController(),
            autorizacoesCadastroRh
        )

        this.registrarSchema()
        this.registrarRotasCrud()
    }
}