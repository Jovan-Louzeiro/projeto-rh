import type { Quinquenio } from "../types";
import { apiBlob, apiFetch, apiGet, apiPost } from "./api";

const endpoint = "/api/quinquenios";

export type CamposQuinquenio = Pick<
  Quinquenio,
  | "numero"
  | "percentualAdicional"
  | "valorCalculado"
  | "dataInicioPagamento"
  | "atoNumero"
  | "atoTipo"
  | "atoData"
  | "observacoes"
>;

export type DadosQuinquenio = CamposQuinquenio & {
  servidorId: string | number;
};

type DadosSituacaoQuinquenio = Pick<Quinquenio, "dataAquisicao" | "dataInicioPagamento" | "situacao">;

function hoje() {
  const partes = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const valor = (tipo: string) => partes.find((parte) => parte.type === tipo)?.value ?? "";
  return `${valor("year")}-${valor("month")}-${valor("day")}`;
}

export function calcularSituacaoQuinquenio(
  dados: DadosSituacaoQuinquenio,
  dataAtual = hoje(),
): Quinquenio["situacao"] {
  if (dados.situacao === "Suspenso" || dados.situacao === "Cancelado") return dados.situacao;
  if (!dados.dataAquisicao || dataAtual < dados.dataAquisicao) return "Aguardando concessão";
  if (!dados.dataInicioPagamento || dataAtual < dados.dataInicioPagamento) return "Concedido";
  return "Implantado";
}

export function listarQuinquenios(signal?: AbortSignal): Promise<Quinquenio[]> {
  return apiGet<Quinquenio[]>(endpoint, { signal });
}

export function buscarQuinquenio(id: string, signal?: AbortSignal): Promise<Quinquenio> {
  return apiGet<Quinquenio>(`${endpoint}/${encodeURIComponent(id)}`, { signal });
}

function dadosFormulario(dados: CamposQuinquenio | DadosQuinquenio, documento?: File) {
  const form = new FormData();
  form.append("dados", JSON.stringify(dados));
  if (documento) form.append("atoDocumento", documento);
  return form;
}

export function cadastrarQuinquenio(
  dados: DadosQuinquenio,
  documento?: File,
): Promise<Quinquenio> {
  return apiFetch<Quinquenio>(endpoint, {
    method: "POST",
    body: dadosFormulario(dados, documento),
  });
}

export function atualizarQuinquenio(
  id: string,
  dados: CamposQuinquenio,
  documento?: File,
): Promise<Quinquenio> {
  return apiFetch<Quinquenio>(`${endpoint}/${encodeURIComponent(id)}`, {
    method: "PUT",
    body: dadosFormulario(dados, documento),
  });
}

export function cancelarQuinquenio(id: string): Promise<Quinquenio> {
  return apiPost<Quinquenio>(`${endpoint}/${encodeURIComponent(id)}/cancelar`);
}

export function baixarDocumentoQuinquenio(id: string): Promise<Blob> {
  return apiBlob(`${endpoint}/${encodeURIComponent(id)}/documento`);
}
