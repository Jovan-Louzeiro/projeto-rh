import z from "zod";
import { CrudSchemas } from "./crud.schemas.js";

export class MunicipioSchema extends CrudSchemas {
    
    public readonly adicionar;
    public readonly atualizar;

    constructor() {
        super()

        const baseSchema = z.strictObject({

            nome: this.stringSchema("Nome", 1, 100),
            estado_id: this.idExternoSchema("Estado"),
            ativo: this.ativoSchema()
            
        });

        this.adicionar = baseSchema;

        this.atualizar = baseSchema
            .partial()
            .refine(
                data => Object.keys(data).length > 0,
                {
                    message: "É necessário informar pelo menos um campo para atualizar"
                }
            );
    }
}