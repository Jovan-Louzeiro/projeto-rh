
import type { Ferias } from "../types";

const apiUrl = (
  import.meta.env.VITE_API_URL ??
  "https://projeto-rh-sj48.onrender.com"
).replace(/\/$/, "");

const endpoint = `${apiUrl}/api/ferias`;

function getToken(): string {
  return (
    localStorage.getItem("rh_access_token") ??
    localStorage.getItem("token") ??
    localStorage.getItem("token_access") ??
    localStorage.getItem("accessToken") ??
    localStorage.getItem("access_token") ??
    ""
  );
}

function getHeaders(
  incluirJson = false
): HeadersInit {
  const token = getToken();

  return {
    Accept: "application/json",
    ...(incluirJson
      ? { "Content-Type": "application/json" }
      : {}),
    ...(token
      ? { Authorization: `Bearer ${token}` }
      : {}),
  };
}

async function tratarResposta<T>(
  response: Response
): Promise<T> {
  if (!response.ok) {
    let mensagem = `Erro na API de férias: HTTP ${response.status}`;

    try {
      const body = await response.json();

      mensagem =
        body?.mensagem ??
        body?.message ??
        body?.erro ??
        mensagem;
    } catch {
      // A resposta não contém JSON.
    }

    throw new Error(mensagem);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

type ApiListResponse<T> = T[] | { data?: T[] };

export async function listarFerias(
  signal?: AbortSignal
): Promise<Ferias[]> {
  const response = await fetch(endpoint, {
    method: "GET",
    headers: getHeaders(),
    signal,
  });

  const body =
    await tratarResposta<ApiListResponse<Ferias>>(response);

  return Array.isArray(body)
    ? body
    : body.data ?? [];
}

export async function salvarFerias(
  dados: Omit<Ferias, "id">,
  id?: string
): Promise<Ferias> {
  const response = await fetch(
    id
      ? `${endpoint}/${encodeURIComponent(id)}`
      : endpoint,
    {
      method: id ? "PUT" : "POST",
      headers: getHeaders(true),
      body: JSON.stringify(dados),
    }
  );

  return tratarResposta<Ferias>(response);
}

export async function cancelarFerias(
  id: string
): Promise<void> {
  const response = await fetch(
    `${endpoint}/${encodeURIComponent(id)}/cancelar`,
    {
      method: "POST",
      headers: getHeaders(),
    }
  );

  await tratarResposta<void>(response);
}