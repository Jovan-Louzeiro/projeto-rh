import { getApiUrl, getAuthHeaders } from "./api";

export type Sexo = {
  id: string | number;
  descricao: string;
};

type ApiSexo = {
  id_sexo?: number;
  id?: number;
  descricao?: string;
  nome?: string;
};

export async function listarSexos(
  signal?: AbortSignal
): Promise<Sexo[]> {
  const response = await fetch(
    getApiUrl("/api/sexos"),
    {
      method: "GET",
      headers: getAuthHeaders(),
      signal,
    }
  );

  if (!response.ok) {
    let mensagem =
      `Erro ao carregar /api/sexos: ${response.status}`;

    try {
      const erro = await response.json();

      mensagem =
        erro?.message ??
        erro?.mensagem ??
        erro?.erro ??
        mensagem;
    } catch {
      // A API não retornou JSON.
    }

    throw new Error(mensagem);
  }

  const body = await response.json();

  const lista: ApiSexo[] = Array.isArray(body)
    ? body
    : body?.data ?? [];

  return lista.map((sexo) => ({
    id: sexo.id_sexo ?? sexo.id ?? "",
    descricao: sexo.descricao ?? sexo.nome ?? "",
  }));
}