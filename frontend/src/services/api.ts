// frontend/src/services/api.ts

const API_URL = (
  import.meta.env.VITE_API_URL ??
  "https://projeto-rh-sj48.onrender.com"
).replace(/\/$/, "");

const TOKEN_KEY = "rh_access_token";

/**
 * URL base da API.
 *
 * Exemplo:
 * https://projeto-rh-sj48.onrender.com
 */
export function getApiUrl(path = ""): string {
  return `${API_URL}${path}`;
}

/**
 * Recupera o token JWT salvo no navegador.
 */
export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

/**
 * Salva o token JWT da sessão.
 */
export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

/**
 * Remove o token JWT da sessão.
 */
export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

/**
 * Verifica se existe uma sessão autenticada.
 */
export function isAuthenticated(): boolean {
  return Boolean(getToken());
}

/**
 * Monta os headers padrão da API.
 */
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

/**
 * Erro padronizado retornado pelo cliente da API.
 */
export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(
    message: string,
    status: number,
    data?: unknown,
  ) {
    super(message);

    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

/**
 * Tenta transformar a resposta da API em JSON.
 *
 * Algumas respostas podem não possuir corpo.
 */
async function parseResponse(response: Response): Promise<unknown> {
  const contentType = response.headers.get("content-type") ?? "";

  if (!contentType.includes("application/json")) {
    return null;
  }

  try {
    return await response.json();
  } catch {
    return null;
  }
}

/**
 * Extrai uma mensagem útil de erro da API.
 */
function getErrorMessage(
  data: unknown,
  status: number,
): string {
  if (typeof data === "string" && data.trim()) {
    return data;
  }

  if (data && typeof data === "object") {
    const body = data as Record<string, unknown>;

    // O middleware do backend responde Zod com { erro, detalhes: issues }.
    // Prioriza os issues porque `erro` sozinho seria apenas DADOS_INVALIDOS.
    if (Array.isArray(body.detalhes)) {
      const issues = body.detalhes
        .map((item) => {
          if (!item || typeof item !== "object") return "";
          const issue = item as { path?: unknown; message?: unknown };
          const path = Array.isArray(issue.path)
            ? issue.path.filter((part) => typeof part === "string" || typeof part === "number").join(".")
            : "";
          const message = typeof issue.message === "string" ? issue.message : "Valor inválido.";
          const campo = path ? nomeCampo(path) : "Dados";
          return `${campo}: ${message}`;
        })
        .filter(Boolean);

      if (issues.length) return `Verifique os dados informados:\n• ${issues.join("\n• ")}`;
    }

    const possibleMessages = [
      body.message,
      body.mensagem,
      body.error,
      body.detail,
      body.details,
      body.erro,
    ];

    for (const message of possibleMessages) {
      if (typeof message === "string" && message.trim()) {
        return message;
      }
    }

    /**
     * Algumas APIs retornam erros de validação
     * como objeto ou array.
     *
     * Nesse caso tentamos gerar uma mensagem
     * minimamente útil para a interface.
     */
    if (body.errors) {
      if (typeof body.errors === "string") {
        return body.errors;
      }

      try {
        return JSON.stringify(body.errors);
      } catch {
        // Continua para a mensagem padrão.
      }
    }
  }

  switch (status) {
    case 400:
      return "Dados inválidos enviados para a API.";

    case 401:
      return "Sessão expirada ou não autorizada.";

    case 403:
      return "Você não tem permissão para realizar esta operação.";

    case 404:
      return "Recurso não encontrado.";

    case 409:
      return "Não foi possível concluir a operação porque existe um conflito.";

    case 422:
      return "Os dados enviados não passaram pela validação.";

    case 500:
      return "Erro interno do servidor.";

    default:
      return `Erro na comunicação com a API. Código: ${status}.`;
  }
}

const nomesCampos: Record<string, string> = {
  nome_completo: "Nome completo",
  nome_social: "Nome social",
  cpf: "CPF",
  nis_pis: "NIS/PIS",
  data_nascimento: "Data de nascimento",
  nacionalidade_id: "Nacionalidade",
  pais_origem_id: "País de origem",
  ano_chegada_brasil: "Ano de chegada ao Brasil",
  municipio_nascimento_id: "Município de nascimento",
  cpf_mae: "CPF da mãe",
  nome_mae: "Nome da mãe",
  cpf_pai: "CPF do pai",
  nome_pai: "Nome do pai",
  estado_civil_id: "Estado civil",
  uniao_estavel: "União estável",
  sexo_id: "Sexo",
  genero_id: "Gênero",
  racacor_id: "Raça/cor",
  comunidade_indigena_id: "Comunidade indígena",
  cep: "CEP",
  logradouro: "Logradouro",
  numero: "Número",
  complemento: "Complemento",
  bairro: "Bairro",
  municipio_endereco_id: "Município do endereço",
  zona_endereco_id: "Zona do endereço",
  localizacao_diferenciada_id: "Localização diferenciada",
  cartao_sus: "Cartão SUS",
  situacao_id: "Situação",
  escolaridade_id: "Escolaridade",
  tipo_ensino_medio_cursado_id: "Tipo de ensino médio",
  observacao: "Observação",
};

function nomeCampo(path: string): string {
  const ultimoSegmento = path.split(".").at(-1) ?? path;
  return nomesCampos[ultimoSegmento] ?? ultimoSegmento.replaceAll("_", " ");
}

/**
 * Cliente HTTP centralizado do RH Digital.
 *
 * Todas as requisições autenticadas podem usar esta função.
 */
export async function apiFetch<T = unknown>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const normalizedEndpoint = endpoint.startsWith("/")
    ? endpoint
    : `/${endpoint}`;

  const url = `${API_URL}${normalizedEndpoint}`;

  const headers = new Headers(getAuthHeaders());

  /**
   * Mantém headers enviados pelo serviço específico.
   */
  if (options.headers) {
    const customHeaders = new Headers(options.headers);

    customHeaders.forEach((value, key) => {
      headers.set(key, value);
    });
  }

  /**
   * Só define Content-Type como JSON quando
   * existe um body e o serviço ainda não definiu
   * outro Content-Type.
   */
  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  let response: Response;

  try {
    response = await fetch(url, {
      ...options,
      headers,
    });
  } catch (error) {
    // Cancelamentos de navegação/unmount são controle de fluxo,
    // não falhas de conexão da API.
    if (
      (options.signal?.aborted) ||
      (error instanceof DOMException && error.name === "AbortError") ||
      (error instanceof Error && error.name === "AbortError")
    ) {
      throw error;
    }

    if (error instanceof Error) {
      throw new ApiError(
        `Não foi possível conectar à API: ${error.message}`,
        0,
      );
    }

    throw new ApiError(
      "Não foi possível conectar à API.",
      0,
    );
  }

  const data = await parseResponse(response);

  /**
   * Token inválido ou expirado.
   *
   * Não removemos automaticamente em toda chamada,
   * porque a tela de login pode precisar tratar o erro.
   */
  if (response.status === 401) {
    throw new ApiError(
      getErrorMessage(data, response.status),
      response.status,
      data,
    );
  }

  if (!response.ok) {
    throw new ApiError(
      getErrorMessage(data, response.status),
      response.status,
      data,
    );
  }

  /**
   * Algumas requisições DELETE/PATCH podem retornar
   * 204 No Content.
   */
  if (data === null) {
    return undefined as T;
  }

  return data as T;
}

/**
 * GET
 */
export function apiGet<T = unknown>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  return apiFetch<T>(endpoint, {
    ...options,
    method: "GET",
  });
}

/** Compatibilidade com as telas legadas que listam recursos da API. */
export async function listar<T extends Record<string, unknown>>(
  recurso: string,
  signal?: AbortSignal,
): Promise<T[]> {
  const body = await apiGet<unknown>(`/api/${recurso}`, { signal });
  if (Array.isArray(body)) return body as T[];
  if (body && typeof body === "object" && Array.isArray((body as { data?: unknown }).data)) {
    return (body as { data: T[] }).data;
  }
  return [];
}

/**
 * POST
 */
export function apiPost<T = unknown>(
  endpoint: string,
  body?: unknown,
  options: RequestInit = {},
): Promise<T> {
  return apiFetch<T>(endpoint, {
    ...options,
    method: "POST",
    body:
      body === undefined
        ? undefined
        : JSON.stringify(body),
  });
}

/**
 * PATCH
 */
export function apiPatch<T = unknown>(
  endpoint: string,
  body?: unknown,
  options: RequestInit = {},
): Promise<T> {
  return apiFetch<T>(endpoint, {
    ...options,
    method: "PATCH",
    body:
      body === undefined
        ? undefined
        : JSON.stringify(body),
  });
}

/**
 * PUT
 */
export function apiPut<T = unknown>(
  endpoint: string,
  body?: unknown,
  options: RequestInit = {},
): Promise<T> {
  return apiFetch<T>(endpoint, {
    ...options,
    method: "PUT",
    body:
      body === undefined
        ? undefined
        : JSON.stringify(body),
  });
}

/**
 * DELETE
 */
export function apiDelete<T = unknown>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  return apiFetch<T>(endpoint, {
    ...options,
    method: "DELETE",
  });
}

/**
 * Exportação da URL para casos em que algum
 * serviço precise montar uma URL manualmente.
 */
export { API_URL, TOKEN_KEY };
