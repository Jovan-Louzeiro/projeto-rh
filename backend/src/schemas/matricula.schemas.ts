import { CrudSchemas } from "@/schemas/crud.schemas.js";
import z from "zod";

export class MatriculaSchemas extends CrudSchemas {

    public baseSchema = z.strictObject({

        ativo:
            this.ativoSchema(),

        numero:
            this.numeroSchema("Numero da Matrícula", undefined, 50),

        admissao:
            this.dataSchema("Admissão"),

        servidor_id: z
            .number()
    })

    public adicionar = this.baseSchema.extend({
        
    })

    public atualizar = this.baseSchema

}

export type MatriculaCreate = z.infer<
    MatriculaSchemas["adicionar"]
>

export type MatriculaUpdate = z.infer<
    MatriculaSchemas["atualizar"]
>