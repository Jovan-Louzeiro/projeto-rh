import { CrudSchemas } from "@/schemas/crud.schemas.js";
import { HistoricoFuncionalSchemas } from "@/schemas/historicoFuncional.schema.js";
import z, { keyof } from "zod";

export class MatriculaSchemas extends CrudSchemas {

    private historicosFuncionais = new HistoricoFuncionalSchemas()

    public baseSchema = z.strictObject({

        ativo:
            this.ativoSchema(),

        numero:
            this.numeroSchema("Numero da Matrícula", undefined, 50),

        admissao:
            this.dataSchema("Admissão"),

        tipo_vinculo_id:
            this.idExternoSchema("Tipo de Vinculo"),

        servidor_id: z
            .number()
    })

    public adicionar = this.baseSchema

    public atualizar = this.baseSchema

    public servidorSchema = this.baseSchema
        .omit({
            servidor_id: true
        })
        .extend({
            historicos_funcionais: z.array(this.historicosFuncionais.matriculaSchema).optional()
        })

    public queryParams = this.baseSchema
        .strip()
        .extend({
            select: z.array(this.baseSchema.keyof())
        })
        .partial()

}

export type MatriculaCreate = z.infer<
    MatriculaSchemas["adicionar"]
>

export type MatriculaUpdate = z.infer<
    MatriculaSchemas["atualizar"]
>