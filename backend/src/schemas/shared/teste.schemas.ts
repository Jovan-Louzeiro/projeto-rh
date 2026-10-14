import { DepartamentoSchemas } from "@/schemas/dominios/departamento.schema.js";
import { z } from "zod";

const jsonSchema = z.toJSONSchema(
  new DepartamentoSchemas().adicionar
);

console.log(jsonSchema)