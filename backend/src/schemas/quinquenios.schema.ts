import z from "zod";

const data = z.string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Informe uma data válida.")
  .refine((value) => {
    const parsed = new Date(`${value}T00:00:00.000Z`);
    return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
  }, "Informe uma data válida.");

const camposComuns = {
  numero: z.coerce.number().int().min(1).max(100),
  percentualAdicional: z.coerce.number().finite().min(0),
  valorCalculado: z.coerce.number().finite().min(0),
  dataInicioPagamento: data,
  atoNumero: z.string().trim().min(1).max(100),
  atoTipo: z.string().trim().min(1).max(100),
  atoData: data,
  observacoes: z.string().trim().max(2000).default(""),
};

export const quinquenioSchema = z.strictObject({
  servidorId: z.coerce.number().int().positive(),
  ...camposComuns,
});

export const quinquenioCamposSchema = z.strictObject(camposComuns);

export const quinquenioIdSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export type QuinquenioDados = z.infer<typeof quinquenioSchema>;
export type QuinquenioCampos = z.infer<typeof quinquenioCamposSchema>;
