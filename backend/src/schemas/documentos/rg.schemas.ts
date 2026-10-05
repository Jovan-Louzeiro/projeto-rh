import z from "zod";
import { CrudSchemas } from "../crud.schemas.js";

export class RgSchemas extends CrudSchemas {

    public readonly adicionar;
    public readonly atualizar;

    constructor() {

        super();

        const baseSchema = z.strictObject({

            rg: this.stringSchema("Rg", 1, 30).transform((val) => val?.replace(/\D/g, "") ?? ""),
                
            rg_orgao_emissor: this.stringSchema("Orgão Emissor", 1, 30),

            ativo: this.ativoSchema(),

            rg_uf_id: this.idExternoSchema("ID da UF do RG"),

            rg_data_emissao: this.dataSchema("Data Emissão")
            
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