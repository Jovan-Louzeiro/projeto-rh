import type { AnexoRequerimento, HistoricoRequerimento, Requerimento, SituacaoRequerimento, TipoRequerimento } from "../types";
import { apiBlob, apiDelete, apiFetch, apiGet, apiPatch } from "./api";

const endpoint = "/api/requerimentos";

type DadosRequerimento = {
  protocolo: string;
  servidorId: string;
  matriculaId: string;
  nomeCompleto: string;
  tipos: TipoRequerimento[];
  outroEspecificacao?: string;
  justificativa: string;
  aceite: true;
  servidor?: string;
  matricula?: string;
  cpf?: string;
  cargo?: string;
  secretaria?: string;
  lotacao?: string;
  dataAdmissao?: string;
  endereco?: string;
  numeroEndereco?: string;
  bairro?: string;
  cidade?: string;
  telefone?: string;
};

export type FiltrosRequerimento = {
  busca?: string;
  situacao?: string;
  tipo?: string;
  servidorId?: string;
  dataInicial?: string;
  dataFinal?: string;
};

function dadosForm(dados: DadosRequerimento, anexos: File[]) {
  const form = new FormData();
  form.append("dados", JSON.stringify({
    protocolo: dados.protocolo,
    servidorId: dados.servidorId,
    matriculaId: dados.matriculaId,
    nomeCompleto: dados.nomeCompleto,
    tipos: dados.tipos,
    outroEspecificacao: dados.outroEspecificacao,
    justificativa: dados.justificativa,
    aceite: dados.aceite,
  }));
  anexos.forEach(anexo => form.append("anexos", anexo));
  return form;
}

export async function listarRequerimentos(
  filtros: FiltrosRequerimento = {},
  signal?: AbortSignal,
): Promise<Requerimento[]> {
  const params = new URLSearchParams(
    Object.entries(filtros).filter(([, value]) => Boolean(value)) as [string, string][],
  );
  return apiGet<Requerimento[]>(`${endpoint}${params.size ? `?${params}` : ""}`, { signal });
}

export async function obterRequerimento(id: string, signal?: AbortSignal): Promise<Requerimento> {
  return apiGet<Requerimento>(`${endpoint}/${encodeURIComponent(id)}`, { signal });
}

export async function criarRequerimento(
  dados: DadosRequerimento,
  anexos: File[],
): Promise<Requerimento> {
  return apiFetch<Requerimento>(endpoint, {
    method: "POST",
    body: dadosForm(dados, anexos),
  });
}

export async function atualizarRequerimento(
  id: string,
  dados: DadosRequerimento,
  anexos: File[],
): Promise<Requerimento> {
  return apiFetch<Requerimento>(`${endpoint}/${encodeURIComponent(id)}`, {
    method: "PUT",
    body: dadosForm(dados, anexos),
  });
}

export async function excluirRequerimento(id: string): Promise<void> {
  await apiDelete(`${endpoint}/${encodeURIComponent(id)}`);
}

export async function alterarSituacaoRequerimento(
  id: string,
  situacao: SituacaoRequerimento,
  observacao: string,
): Promise<Requerimento> {
  return apiPatch<Requerimento>(`${endpoint}/${encodeURIComponent(id)}/status`, {
    situacao,
    observacao,
  });
}

export async function obterHistoricoRequerimento(
  id: string,
  signal?: AbortSignal,
): Promise<HistoricoRequerimento[]> {
  return apiGet<HistoricoRequerimento[]>(`${endpoint}/${encodeURIComponent(id)}/historico`, { signal });
}

export async function gerarDocumentoRequerimento(id: string): Promise<Blob> {
  return apiBlob(`${endpoint}/${encodeURIComponent(id)}/documento`, {
    headers: {
      Accept: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    },
  });
}

export async function baixarAnexoRequerimento(id: string, anexoId: string): Promise<Blob> {
  return apiBlob(`${endpoint}/${encodeURIComponent(id)}/anexos/${encodeURIComponent(anexoId)}`);
}

export async function excluirAnexoRequerimento(id: string, anexoId: string): Promise<void> {
  await apiDelete(`${endpoint}/${encodeURIComponent(id)}/anexos/${encodeURIComponent(anexoId)}`);
}

export async function enviarPdfAssinado(id: string, arquivo: File): Promise<AnexoRequerimento> {
  const form = new FormData();
  form.append("arquivo", arquivo);
  return apiFetch<AnexoRequerimento>(`${endpoint}/${encodeURIComponent(id)}/assinado`, {
    method: "POST",
    body: form,
  });
}

export const LIMITE_ANEXO_REQUERIMENTO = Number(
  import.meta.env.VITE_REQUERIMENTOS_MAX_UPLOAD_BYTES ?? 10 * 1024 * 1024,
);
export const TIPOS_ARQUIVO_REQUERIMENTO = ["application/pdf", "image/jpeg", "image/png"];
