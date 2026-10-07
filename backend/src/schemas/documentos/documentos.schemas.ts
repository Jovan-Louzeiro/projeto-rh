import z from "zod";
import { CrudSchemas } from "../crud.schemas.js";

export class DocumentosSchema extends CrudSchemas {

    constructor(){

        const params = z.strictObject({
            idServidor: z.coerce
                .number("Parâmetro inválido")
                .int("O ID deve ser um número inteiro")
                .positive("O ID deve ser positivo")
        });

        super(params)
    }

}