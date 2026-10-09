import { apiGet } from "./api";

export type Pais = { id_pais: number; nome: string; gentilico: string; codigo_iso: string };
export type Estado = { id_estado: number; nome: string; uf: string; pais_id: number };
export type Municipio = { id_municipio: number; nome: string; estado_id: number };

async function listar<T>(rota: string, signal?: AbortSignal): Promise<T[]> {
  const response = await apiGet<unknown>(`/api/${rota}`, { signal });
  if (Array.isArray(response)) return response as T[];
  if (response && typeof response === "object" && Array.isArray((response as { data?: unknown }).data)) {
    return (response as { data: T[] }).data;
  }
  return [];
}

export const listarPaises = (signal?: AbortSignal) => listar<Pais>("pais", signal);
export const listarEstados = (signal?: AbortSignal) => listar<Estado>("estados", signal);
export const listarMunicipios = (signal?: AbortSignal) => listar<Municipio>("municipios", signal);

export type DadosGeograficos = { paises: Pais[]; estados: Estado[]; municipios: Municipio[] };

export async function carregarDadosGeograficos(signal?: AbortSignal): Promise<DadosGeograficos> {
  const [paises, estados, municipios] = await Promise.all([
    listarPaises(signal), listarEstados(signal), listarMunicipios(signal),
  ]);
  return { paises, estados, municipios };
}
