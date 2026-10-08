import type { Solicitacao } from "../types";

const API_URL = (
  import.meta.env.VITE_API_URL ??
  "https://projeto-rh-sj48.onrender.com"
).replace(/\/$/, "");

const endpoint = `${API_URL}/api/solicitacoes`;

type ApiListResponse = Solicitacao[] | { data?: Solicitacao[] };

export async function listarSolicitacoes(
  signal?: AbortSignal
): Promise<Solicitacao[]> {
  const response = await fetch(endpoint, {
    headers: {
      Accept: "application/json",
    },
    signal,
  });

  if (!response.ok) {
    throw new Error("Não foi possível carregar solicitações.");
  }

  const body: ApiListResponse = await response.json();

  return Array.isArray(body) ? body : body.data ?? [];
}

export async function salvarSolicitacao(
  dados: Omit<Solicitacao, "id">,
  anexo?: File,
  id?: string
): Promise<Solicitacao> {
  const form = new FormData();

  form.append("dados", JSON.stringify(dados));

  if (anexo) {
    form.append("anexo", anexo);
  }

  const response = await fetch(
    id ? `${endpoint}/${id}` : endpoint,
    {
      method: id ? "PUT" : "POST",
      headers: {
        Accept: "application/json",
      },
      body: form,
    }
  );

  if (!response.ok) {
    throw new Error("Não foi possível salvar a solicitação.");
  }

  return response.json();
}

export async function excluirSolicitacao(
  id: string
): Promise<void> {
  const response = await fetch(`${endpoint}/${id}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Não foi possível excluir a solicitação.");
  }
}
