import { CrudSchemas } from "@/schemas/crud.schemas.js"
import z, { ZodType } from "zod";

export abstract class DocumentosSchema extends CrudSchemas {

    public abstract readonly schemaServidor: ZodType

    constructor() {

        super()

    }



}