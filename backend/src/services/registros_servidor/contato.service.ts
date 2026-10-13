import { prisma } from "@/lib/prisma.js";
import { RegistrosServidorServices } from "@/services/registros_servidor/registrosServidor.service.js";

export class ContatoService<TCreate, TUpdate> extends RegistrosServidorServices<TCreate, TUpdate>{
    
    constructor(){
        super(
            prisma.contato,
            "Contato",
            {
                procurar: "id_contato",
                deletar: "id_contato",
                atualizar: "id_contato"
            }
        )
    }

}