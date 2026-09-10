import type { HistoricoRequerimento, Requerimento, SituacaoRequerimento } from "../types";

const apiUrl = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "");
const endpoint = `${apiUrl}/api/requerimentos`;
const usarMock = import.meta.env.VITE_USE_REQUERIMENTOS_MOCK === "true";
let registrosMock: Requerimento[] = [];
const hoje = () => new Date().toISOString().slice(0, 10);
const idMock = () => `${Date.now()}-${Math.random().toString(36).slice(2)}`;
type ApiList = Requerimento[] | { data?: Requerimento[] };
export type FiltrosRequerimento = { busca?: string; situacao?: string; tipo?: string; dataInicial?: string; dataFinal?: string };

async function resposta<T>(response: Response, mensagem: string): Promise<T> { if (!response.ok) throw new Error(mensagem); return response.json() as Promise<T>; }
export async function listarRequerimentos(filtros: FiltrosRequerimento = {}, signal?: AbortSignal): Promise<Requerimento[]> {
  if (usarMock) return registrosMock;
  const params = new URLSearchParams(Object.entries(filtros).filter(([, value]) => Boolean(value)) as [string, string][]);
  const response = await fetch(`${endpoint}${params.size ? `?${params}` : ""}`, { headers: { Accept: "application/json" }, signal });
  const body = await resposta<ApiList>(response, "Não foi possível carregar os requerimentos.");
  return Array.isArray(body) ? body : body.data ?? [];
}
export async function obterRequerimento(id: string, signal?: AbortSignal): Promise<Requerimento> {
  if (usarMock) { const item = registrosMock.find(registro => registro.id === id); if (!item) throw new Error("Requerimento não encontrado."); return item; }
  return resposta<Requerimento>(await fetch(`${endpoint}/${id}`, { headers: { Accept: "application/json" }, signal }), "Não foi possível carregar o requerimento.");
}
export async function obterProximoProtocolo(): Promise<string> {
  if (usarMock) return `REQ-${new Date().getFullYear()}-${String(registrosMock.length + 1).padStart(6, "0")}`;
  const body = await resposta<{ protocolo?: string }>(await fetch(`${endpoint}/proximo-protocolo`, { headers: { Accept: "application/json" } }), "Não foi possível gerar o protocolo.");
  if (!body.protocolo) throw new Error("A API não retornou um protocolo válido."); return body.protocolo;
}
type DadosRequerimento = Omit<Requerimento, "id" | "anexos" | "historico">;
function dadosForm(dados: DadosRequerimento, anexos: File[]) { const form = new FormData(); form.append("dados", JSON.stringify(dados)); anexos.forEach(anexo => form.append("anexos", anexo)); return form; }
export async function criarRequerimento(dados: DadosRequerimento, anexos: File[]): Promise<Requerimento> {
  if (usarMock) { const item: Requerimento = { ...dados, id: idMock(), protocolo: dados.protocolo || await obterProximoProtocolo(), anexos: anexos.map(a => ({ nome: a.name, tipo: a.type, tamanho: a.size, enviadoEm: new Date().toISOString() })), historico: [{ id: idMock(), dataHora: new Date().toISOString(), situacaoNova: "Pendente", responsavel: "Usuário autenticado", observacao: "Requerimento criado." }] }; registrosMock = [item, ...registrosMock]; return item; }
  return resposta<Requerimento>(await fetch(endpoint, { method: "POST", headers: { Accept: "application/json" }, body: dadosForm(dados, anexos) }), "Não foi possível salvar o requerimento.");
}
export async function atualizarRequerimento(id: string, dados: DadosRequerimento, anexos: File[]): Promise<Requerimento> {
  if (usarMock) { const existente = await obterRequerimento(id); const item = { ...existente, ...dados, anexos: [...existente.anexos, ...anexos.map(a => ({ nome: a.name, tipo: a.type, tamanho: a.size, enviadoEm: new Date().toISOString() }))] }; registrosMock = registrosMock.map(registro => registro.id === id ? item : registro); return item; }
  return resposta<Requerimento>(await fetch(`${endpoint}/${id}`, { method: "PUT", headers: { Accept: "application/json" }, body: dadosForm(dados, anexos) }), "Não foi possível atualizar o requerimento.");
}
export async function excluirRequerimento(id: string): Promise<void> { if (usarMock) { registrosMock = registrosMock.filter(registro => registro.id !== id); return; } const response = await fetch(`${endpoint}/${id}`, { method: "DELETE", headers: { Accept: "application/json" } }); if (!response.ok) throw new Error("Não foi possível excluir o requerimento."); }
export async function alterarSituacaoRequerimento(id: string, situacao: SituacaoRequerimento, observacao: string): Promise<Requerimento> {
  if (usarMock) { const atual = await obterRequerimento(id); const item = { ...atual, situacao, historico: [...(atual.historico ?? []), { id: idMock(), dataHora: new Date().toISOString(), situacaoAnterior: atual.situacao, situacaoNova: situacao, responsavel: "Usuário autenticado", observacao }] }; registrosMock = registrosMock.map(registro => registro.id === id ? item : registro); return item; }
  return resposta<Requerimento>(await fetch(`${endpoint}/${id}/status`, { method: "PATCH", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify({ situacao, observacao }) }), "Não foi possível alterar a situação.");
}
export async function obterHistoricoRequerimento(id: string): Promise<HistoricoRequerimento[]> { if (usarMock) return (await obterRequerimento(id)).historico ?? []; const body = await resposta<HistoricoRequerimento[] | { data?: HistoricoRequerimento[] }>(await fetch(`${endpoint}/${id}/historico`, { headers: { Accept: "application/json" } }), "Não foi possível carregar o histórico."); return Array.isArray(body) ? body : body.data ?? []; }
export async function gerarPdfRequerimento(id: string): Promise<Blob> { const response = await fetch(`${endpoint}/${id}/pdf`, { method: "POST", headers: { Accept: "application/pdf" } }); if (!response.ok) throw new Error("Não foi possível gerar o PDF do requerimento."); return response.blob(); }
export const LIMITE_ANEXO_REQUERIMENTO = Number(import.meta.env.VITE_REQUERIMENTOS_MAX_UPLOAD_BYTES ?? 10 * 1024 * 1024);
export const TIPOS_ARQUIVO_REQUERIMENTO = ["application/pdf", "image/jpeg", "image/png"];
