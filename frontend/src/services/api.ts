const API_URL = (
  import.meta.env.VITE_API_URL ??
  "https://projeto-rh-sj48.onrender.com"
).replace(/\/$/, "");

export type ApiResponse<T> =
  | T[]
  | {
      data?: T[];
    };

export function getApiUrl(path: string): string {
  return `${API_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

function getToken(): string | null {
  const token =
    localStorage.getItem("rh_access_token") ??
    localStorage.getItem("token");

  console.log(
    "[API] Token:",
    token ? "TOKEN ENCONTRADO" : "TOKEN NÃO ENCONTRADO"
  );

  return token;
}

export function getAuthHeaders(): HeadersInit {
  const token = getToken();

  return {
    Accept: "application/json",
    ...(token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {}),
  };
}

export function getJsonHeaders(): HeadersInit {
  const token = getToken();

  return {
    Accept: "application/json",
    "Content-Type": "application/json",
    ...(token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {}),
  };
}

/*
 * Função mantida para compatibilidade
 * com as telas que já utilizavam listar().
 */
export async function listar<
  T extends Record<string, unknown>
>(
  recurso: string,
  signal?: AbortSignal
): Promise<T[]> {
  const response = await fetch(
    getApiUrl(`/api/${recurso}`),
    {
      method: "GET",
      headers: getAuthHeaders(),
      signal,
    }
  );

  if (!response.ok) {
    let mensagem =
      `Não foi possível carregar ${recurso}. Status: ${response.status}`;

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

  const body: ApiResponse<T> =
    await response.json();

  return Array.isArray(body)
    ? body
    : body.data ?? [];
}