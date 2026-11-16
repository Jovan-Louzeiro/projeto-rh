import { z } from "zod";

export const TIPOS_REQUERIMENTO = [
    "Licença para qualificação profissional",
    "Revisão de proventos",
    "Aposentadoria",
    "Afastamento para mandato eletivo",
    "Licença paternidade",
    "Promoção docente",
    "Licença para tratar de interesse particular",
    "Pagamento de atrasados",
    "Licença maternidade",
    "Licença motivo doença pessoa da família",
    "Mudança de dados pessoais",
    "Declaração",
    "Licença para tratamento de saúde",
    "Licença prêmio por assiduidade",
    "Férias",
    "Remoção",
    "Certidão de tempo de serviço",
    "Outros",
] as const;

export const SITUACOES_REQUERIMENTO = [
    "Pendente",
    "Em análise",
    "Deferido",
    "Indeferido",
    "Finalizado",
    "Cancelado",
] as const;

export const RequerimentoInputSchema = z.strictObject({
    protocolo: z.string().trim().min(1, "Informe o número do protocolo.").max(100),
    servidorId: z.coerce.number().int().positive(),
    matriculaId: z.coerce.number().int().positive(),
    nomeCompleto: z.string().trim().min(1, "Informe o nome completo do servidor.").max(150).optional(),
    tipos: z.array(z.enum(TIPOS_REQUERIMENTO)).min(1),
    outroEspecificacao: z.string().trim().max(1000).optional(),
    justificativa: z.string().trim().max(3000),
    aceite: z.literal(true),
}).superRefine((dados, contexto) => {
    if (dados.tipos.includes("Outros") && !dados.outroEspecificacao?.trim()) {
        contexto.addIssue({
            code: "custom",
            path: ["outroEspecificacao"],
            message: "Especifique o outro requerimento.",
        });
    }
});

export const SituacaoRequerimentoSchema = z.strictObject({
    situacao: z.enum(SITUACOES_REQUERIMENTO),
    observacao: z.string().trim().max(1000).default(""),
});

export type RequerimentoInput = z.infer<typeof RequerimentoInputSchema>;
export type SituacaoRequerimento = z.infer<typeof SituacaoRequerimentoSchema>["situacao"];

export type RequerimentoDadosHistoricos = {
    numero_protocolo: string;
    data_entrada: string;
    nome_completo: string;
    matricula_numero: string;
    admissao_matricula: string;
    cargo_descricao: string;
    funcao_descricao: string;
    departamento_descricao: string;
    endereco_logradouro: string;
    numero_endereco: string;
    bairro_endereco: string;
    cidade_endereco: string;
    telefone: string;
    cpf: string;
    tipos: RequerimentoInput["tipos"][number][];
    outro_especificacao?: string;
    justificativa: string;
    situacao: SituacaoRequerimento;
    responsavel: string;
    assinatura: {
        aceite: boolean;
        dataHora: string;
        usuario: string;
        ip?: string;
    };
    historico: {
        id: string;
        dataHora: string;
        situacaoAnterior?: SituacaoRequerimento;
        situacaoNova: SituacaoRequerimento;
        responsavel: string;
        observacao?: string;
    }[];
};
