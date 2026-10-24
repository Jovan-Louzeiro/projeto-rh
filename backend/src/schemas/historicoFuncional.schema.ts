import { CrudSchemas } from "@/schemas/crud.schemas.js";
import z from "zod";

export class HistoricoFuncionalSchemas extends CrudSchemas {

    public adicionar = z.strictObject({

        matricula_id:
            this.idExternoSchema("Matricula Id"),

        cargo_id:
            this.idExternoSchema("Cardo Id"),

        funcao_id:
            this.idExternoSchema("Função Id"),

        departamento_id:
            this.idExternoSchema("Departamento Id"),

        situacao_historico_funcional_id:
            this.idExternoSchema("Situação Id"),

        data_inicio:
            this.dataSchema("Data de Inicio"),

        data_fim:
            this.dataSchema("Data de Fim")
                .optional()

    })

    public atualizar = this.adicionar

    public matriculaSchema = this.adicionar.omit({ matricula_id: true })

    public queryParams = this.adicionar
        .strip()
        .extend({
            select: z
                .array(
                    z.union(
                        [
                            this.adicionar.keyof(),

                            z.literal("cargo"),
                            z.literal("funcao"),
                            z.literal("departamento"),
                            z.literal("situacao"),
                            z.literal("id_historico_funcional")
                        ]
                    )
                )
        })
        .partial()

}

export type HistoricoFuncionalCreate = z.infer<
    HistoricoFuncionalSchemas["adicionar"]
>

export type HistoricoFuncionalUpdate = z.infer<
    HistoricoFuncionalSchemas["atualizar"]
>