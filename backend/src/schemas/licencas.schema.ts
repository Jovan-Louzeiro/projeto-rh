import z from "zod";

const data = z.string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Informe uma data válida.")
  .refine((value) => {
    const parsed = new Date(`${value}T00:00:00.000Z`);
    return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
  }, "Informe uma data válida.");

const dataOpcional = z.preprocess(
  (value) => value === "" || value === undefined ? null : value,
  data.nullable(),
);

const booleano = z.preprocess((value) => {
  if (value === "true") return true;
  if (value === "false") return false;
  return value;
}, z.boolean());

const camposComuns = {
  tipo: z.string().trim().min(1).max(100),
  inicio: data,
  termino: dataOpcional,
  semDataTermino: booleano,
  previsaoRetorno: dataOpcional,
  numeroDocumento: z.string().trim().max(100).default(""),
  dataDocumento: dataOpcional,
  orgaoEmissor: z.string().trim().max(150).default(""),
  observacoes: z.string().trim().max(2000).default(""),
};

export const licencaSchema = z.strictObject({
  servidorId: z.coerce.number().int().positive(),
  ...camposComuns,
});

export const licencaCamposSchema = z.strictObject(camposComuns);

export const licencaIdSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const licencaServidorIdSchema = z.object({
  idServidor: z.coerce.number().int().positive(),
});

export type LicencaDados = z.infer<typeof licencaSchema>;
export type LicencaCampos = z.infer<typeof licencaCamposSchema>;
