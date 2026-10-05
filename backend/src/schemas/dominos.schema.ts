import z from "zod";
import { CrudSchemas } from "./crud.schemas.js";


export class DominioSchemas extends CrudSchemas {

    public adicionar;
    public atualizar;
    public baseSchema;

    constructor(
        private readonly limiteDescricao: number,
    ) {
        super();

        this.baseSchema = z.strictObject({

            descricao: this.stringSchema("Descrição", 1, limiteDescricao),
            ativo: this.ativoSchema()
            
        });

        this.adicionar = this.baseSchema;

        this.atualizar = this.baseSchema
            .partial()
            .refine(
                data => Object.keys(data).length > 0,
                {
                    message: "É necessário informar pelo menos um campo para atualizar"
                }
            );
    }
}