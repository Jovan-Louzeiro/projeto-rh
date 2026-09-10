export type ApiResponse<T> = T[] | { data?: T[] };
const apiUrl = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "");
export async function listar<T extends Record<string, unknown>>(recurso: string, signal?: AbortSignal): Promise<T[]> {
  const response = await fetch(`${apiUrl}/api/${recurso}`, { headers: { Accept: "application/json" }, signal });
  if (!response.ok) throw new Error(`Não foi possível carregar ${recurso}.`);
  const body: ApiResponse<T> = await response.json();
  return Array.isArray(body) ? body : body.data ?? [];
}
