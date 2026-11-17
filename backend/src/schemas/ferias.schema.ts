import z from "zod";

const data = z.string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Informe uma data válida.")
  .refine((value) => {
    const parsed = new Date(`${value}T00:00:00.000Z`);
    return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
  }, "Informe uma data válida.");

export const feriasSchema = z.strictObject({
  servidorId: z.coerce.number().int().positive(),
  periodoAquisitivoInicio: data,
  periodoAquisitivoFim: data,
  diasDireito: z.coerce.number().int().min(1).max(365),
  inicio: data,
  fim: data,
  abonoPecuniario: z.boolean(),
  antecipacaoDecimoTerceiro: z.boolean(),
  observacoes: z.string().trim().max(1000).default(""),
});

export const feriasCamposSchema = feriasSchema.omit({ servidorId: true });

export const feriasIdSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const feriasServidorIdSchema = z.object({
  idServidor: z.coerce.number().int().positive(),
});

export type FeriasDados = z.infer<typeof feriasSchema>;
export type FeriasCampos = z.infer<typeof feriasCamposSchema>;
