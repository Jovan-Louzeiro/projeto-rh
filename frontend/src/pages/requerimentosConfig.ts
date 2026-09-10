import type { SituacaoRequerimento, TipoRequerimento } from "../types";

export const TIPOS_REQUERIMENTO: TipoRequerimento[] = ["Licença para qualificação profissional", "Revisão de proventos", "Aposentadoria", "Afastamento para mandato eletivo", "Licença paternidade", "Promoção docente", "Licença para tratar de interesse particular", "Pagamento de atrasados", "Licença maternidade", "Licença motivo doença pessoa da família", "Mudança de dados pessoais", "Declaração", "Licença para tratamento de saúde", "Licença prêmio por assiduidade", "Férias", "Remoção", "Certidão de tempo de serviço", "Outros"];
export const SITUACOES_REQUERIMENTO: SituacaoRequerimento[] = ["Pendente", "Em análise", "Deferido", "Indeferido", "Finalizado", "Cancelado"];
export const TRANSICOES_REQUERIMENTO: Record<SituacaoRequerimento, SituacaoRequerimento[]> = {
  "Pendente": ["Em análise", "Cancelado"],
  "Em análise": ["Deferido", "Indeferido", "Cancelado"],
  "Deferido": ["Finalizado"],
  "Indeferido": ["Finalizado"],
  "Finalizado": [],
  "Cancelado": [],
};
export function tomRequerimento(situacao: SituacaoRequerimento): "green" | "yellow" | "blue" | "red" { return situacao === "Deferido" || situacao === "Finalizado" ? "green" : situacao === "Indeferido" || situacao === "Cancelado" ? "red" : situacao === "Pendente" ? "yellow" : "blue"; }
export function formatarData(data?: string) { return data ? data.slice(0, 10).split("-").reverse().join("/") : "—"; }
