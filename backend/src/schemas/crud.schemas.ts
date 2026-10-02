import z from "zod";

export class CrudSchemas {

    public readonly params;

    constructor() {
        this.params = z.object({
            id: z.coerce
                .number("Parâmetro inválido")
                .int("O ID deve ser um número inteiro")
                .positive("O ID deve ser positivo")
        });
    }
}