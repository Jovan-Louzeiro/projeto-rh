import type { LicencaAfastamento } from "../types";
import { apiBlob, apiFetch, apiGet, apiPost, apiPut } from "./api";

const endpoint = "/api/licencas";

export type DadosLicenca = Pick<
  LicencaAfastamento,
  | "servidorId"
  | "tipo"
  | "inicio"
  | "termino"
  | "semDataTermino"
  | "previsaoRetorno"
  | "numeroDocumento"
  | "dataDocumento"
  | "orgaoEmissor"
  | "observacoes"
>;

function campos(dados: DadosLicenca) {
  return {
    tipo: dados.tipo,
    inicio: dados.inicio,
    termino: dados.semDataTermino ? null : dados.termino,
    semDataTermino: dados.semDataTermino,
    previsaoRetorno: dados.previsaoRetorno,
    numeroDocumento: dados.numeroDocumento,
    dataDocumento: dados.dataDocumento,
    orgaoEmissor: dados.orgaoEmissor,
    observacoes: dados.observacoes,
  };
}

export function listarLicencas(signal?: AbortSignal): Promise<LicencaAfastamento[]> {
  return apiGet<LicencaAfastamento[]>(endpoint, { signal });
}

export function listarLicencasServidor(
  servidorId: string,
  signal?: AbortSignal,
): Promise<LicencaAfastamento[]> {
  return apiGet<LicencaAfastamento[]>(
    `/api/servidores/${encodeURIComponent(servidorId)}/licencas`,
    { signal },
  );
}

function enviar(
  url: string,
  metodo: "POST" | "PUT",
  dados: DadosLicenca,
  arquivo?: File | null,
): Promise<LicencaAfastamento> {
  const dadosApi = campos(dados);

  if (arquivo) {
    const formData = new FormData();
    Object.entries(dadosApi).forEach(([chave, valor]) => {
      formData.append(chave, valor == null ? "" : String(valor));
    });
    formData.append("arquivo", arquivo);
    return apiFetch<LicencaAfastamento>(url, { method: metodo, body: formData });
  }

  return metodo === "PUT"
    ? apiPut<LicencaAfastamento>(url, dadosApi)
    : apiPost<LicencaAfastamento>(url, dadosApi);
}

export function criarLicencaParaServidor(
  servidorId: string,
  dados: DadosLicenca,
  arquivo?: File | null,
): Promise<LicencaAfastamento> {
  return enviar(
    `/api/servidores/${encodeURIComponent(servidorId)}/licencas`,
    "POST",
    dados,
    arquivo,
  );
}

export function salvarLicenca(
  dados: DadosLicenca,
  id: string,
  arquivo?: File | null,
): Promise<LicencaAfastamento> {
  return enviar(`${endpoint}/${encodeURIComponent(id)}`, "PUT", dados, arquivo);
}

export function cancelarLicenca(id: string): Promise<LicencaAfastamento> {
  return apiPost<LicencaAfastamento>(`${endpoint}/${encodeURIComponent(id)}/cancelar`);
}

export function baixarDocumentoLicenca(id: string): Promise<Blob> {
  return apiBlob(`${endpoint}/${encodeURIComponent(id)}/documento`);
}
