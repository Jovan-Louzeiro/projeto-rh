import type { Ferias } from "../types";
const apiUrl = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "");
const endpoint = `${apiUrl}/api/ferias`;
type ApiListResponse = Ferias[] | { data?: Ferias[] };
export async function listarFerias(signal?: AbortSignal): Promise<Ferias[]> { const response = await fetch(endpoint, { headers: { Accept: "application/json" }, signal }); if (!response.ok) throw new Error("Não foi possível carregar férias."); const body: ApiListResponse = await response.json(); return Array.isArray(body) ? body : body.data ?? []; }
export async function salvarFerias(dados: Omit<Ferias, "id">, id?: string): Promise<Ferias> { const response = await fetch(id ? `${endpoint}/${id}` : endpoint, { method: id ? "PUT" : "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(dados) }); if (!response.ok) throw new Error("Não foi possível salvar as férias."); return response.json(); }
export async function cancelarFerias(id: string): Promise<void> { const response = await fetch(`${endpoint}/${id}/cancelar`, { method: "POST", headers: { Accept: "application/json" } }); if (!response.ok) throw new Error("Não foi possível cancelar as férias."); }
