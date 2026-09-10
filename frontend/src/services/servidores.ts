import type { Servidor } from "../types";

// Configure VITE_API_URL no .env. Sem ela, usa /api/servidores no mesmo domínio.
const apiUrl = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "");
const endpoint = `${apiUrl}/api/servidores`;
type ApiListResponse = Servidor[] | { data?: Servidor[] };

export async function listarServidores(signal?: AbortSignal): Promise<Servidor[]> {
  const response = await fetch(endpoint, { headers: { Accept: "application/json" }, signal });
  if (!response.ok) throw new Error("Não foi possível carregar os servidores.");
  const body: ApiListResponse = await response.json();
  return Array.isArray(body) ? body : body.data ?? [];
}

export type NovoServidor = {
  nome: string;
  cpf: string;
  rg: string;
  dataNascimento: string;
  matricula: string;
  cargo: string;
  secretaria: string;
  tipoVinculo: string;
  dataAdmissao: string;
  telefone: string;
  sexoId: string;
};

export async function cadastrarServidor(dados: NovoServidor): Promise<Servidor> {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(dados),
  });
  if (!response.ok) throw new Error("Não foi possível cadastrar o servidor.");
  return response.json();
}
