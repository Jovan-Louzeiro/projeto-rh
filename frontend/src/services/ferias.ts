import type { Ferias } from "../types";
import { apiGet, apiPost, apiPut } from "./api";

export type DadosFerias = Pick<
  Ferias,
  | "periodoAquisitivoInicio"
  | "periodoAquisitivoFim"
  | "diasDireito"
  | "inicio"
  | "fim"
  | "abonoPecuniario"
  | "antecipacaoDecimoTerceiro"
  | "observacoes"
> & {
  servidorId: string | number;
};

const endpoint = "/api/ferias";

function campos(dados: DadosFerias) {
  return {
    periodoAquisitivoInicio: dados.periodoAquisitivoInicio,
    periodoAquisitivoFim: dados.periodoAquisitivoFim,
    diasDireito: dados.diasDireito,
    inicio: dados.inicio,
    fim: dados.fim,
    abonoPecuniario: dados.abonoPecuniario,
    antecipacaoDecimoTerceiro: dados.antecipacaoDecimoTerceiro,
    observacoes: dados.observacoes,
  };
}

export function listarFerias(signal?: AbortSignal): Promise<Ferias[]> {
  return apiGet<Ferias[]>(endpoint, { signal });
}

export function listarFeriasServidor(
  servidorId: string,
  signal?: AbortSignal,
): Promise<Ferias[]> {
  return apiGet<Ferias[]>(
    `/api/servidores/${encodeURIComponent(servidorId)}/ferias`,
    { signal },
  );
}

export function criarFerias(
  servidorId: string,
  dados: DadosFerias,
): Promise<Ferias> {
  return apiPost<Ferias>(
    `/api/servidores/${encodeURIComponent(servidorId)}/ferias`,
    campos(dados),
  );
}

export function salvarFerias(
  dados: DadosFerias,
  id: string,
): Promise<Ferias> {
  return apiPut<Ferias>(`${endpoint}/${encodeURIComponent(id)}`, campos(dados));
}

export function cancelarFerias(id: string): Promise<Ferias> {
  return apiPost<Ferias>(`${endpoint}/${encodeURIComponent(id)}/cancelar`);
}
