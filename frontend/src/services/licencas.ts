import type { LicencaAfastamento } from "../types";
const apiUrl = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "");
const endpoint = `${apiUrl}/api/licencas`;
type ApiListResponse = LicencaAfastamento[] | { data?: LicencaAfastamento[] };
export async function listarLicencas(signal?: AbortSignal): Promise<LicencaAfastamento[]> { const response = await fetch(endpoint, { headers: { Accept: "application/json" }, signal }); if (!response.ok) throw new Error("Não foi possível carregar licenças."); const body: ApiListResponse = await response.json(); return Array.isArray(body) ? body : body.data ?? []; }
export async function salvarLicenca(dados: Omit<LicencaAfastamento, "id">, id?: string): Promise<LicencaAfastamento> { const response = await fetch(id ? `${endpoint}/${id}` : endpoint, { method: id ? "PUT" : "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(dados) }); if (!response.ok) throw new Error("Não foi possível salvar a licença."); return response.json(); }
export async function cancelarLicenca(id: string): Promise<void> { const response = await fetch(`${endpoint}/${id}/cancelar`, { method: "POST", headers: { Accept: "application/json" } }); if (!response.ok) throw new Error("Não foi possível cancelar a licença."); }
