import { CrudSchemas } from "@/schemas/crud.schemas.js";
import z from "zod";

export class MatriculaSchemas extends CrudSchemas{

    public readonly adicionar;
    public readonly atualizar;

    constructor(){
        
        super()

        const baseSchema = z.strictObject({

            ativo: 
                this.ativoSchema(),

            numero: 
                this.numeroSchema("Numero da Matrícula", undefined, 50),
            
            admissao:
                this.dataSchema("Admissão"),

            servidor_id: z
                .number()
        })

        this.adicionar = baseSchema

        this.atualizar = baseSchema

    }

}

export type MatriculaCreate = z.infer<
    MatriculaSchemas["adicionar"]
>

export type MatriculaUpdate = z.infer<
    MatriculaSchemas["atualizar"]
>