import type { Contrato } from "../types";
const apiUrl = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "");
const endpoint = `${apiUrl}/api/contratos`;
type ApiListResponse = Contrato[] | { data?: Contrato[] };
export async function listarContratos(signal?: AbortSignal): Promise<Contrato[]> { const response = await fetch(endpoint, { headers: { Accept: "application/json" }, signal }); if (!response.ok) throw new Error("Não foi possível carregar contratos."); const body: ApiListResponse = await response.json(); return Array.isArray(body) ? body : body.data ?? []; }
export async function cadastrarContrato(dados: Omit<Contrato, "id">, arquivos: Record<string, File[] | undefined>): Promise<Contrato> { const form = new FormData(); form.append("dados", JSON.stringify(dados)); Object.entries(arquivos).forEach(([campo, files]) => files?.forEach(file => form.append(campo, file))); const response = await fetch(endpoint, { method: "POST", headers: { Accept: "application/json" }, body: form }); if (!response.ok) throw new Error("Não foi possível salvar o contrato."); return response.json(); }
