import { getAuthHeaders } from "./api";

const API_URL = import.meta.env.VITE_API_URL;

export async function adicionarRegistro(
  dominio: string,
  dados: Record<string, unknown>
): Promise<unknown> {
  const resposta = await fetch(
    `${API_URL}/api/${dominio}`,
    {
      method: "POST",
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dados),
    }
  );

  const resultado = await resposta.json().catch(() => null);

  if (!resposta.ok) {
    throw new Error(
      resultado?.mensagem ??
      resultado?.erro ??
      `Erro ao cadastrar registro: ${resposta.status}`
    );
  }

  return resultado;
}
