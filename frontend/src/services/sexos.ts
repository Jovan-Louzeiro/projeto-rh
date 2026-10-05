export type Sexo = {
  id: string | number;
  descricao: string;
  ativo: boolean;
};

const API_URL = (
  import.meta.env.VITE_API_URL ??
  "https://projeto-rh-sj48.onrender.com"
).replace(/\/$/, "");

export async function listarSexos(
  signal?: AbortSignal
): Promise<Sexo[]> {
  const token = localStorage.getItem("rh_access_token");
  const response = await fetch(
    `${API_URL}/api/sexos?mostrarTudo=true`,
    {
      method: "GET",

      headers: {
        Accept: "application/json",
        ...(token
          ? { Authorization: token.startsWith("Bearer ") ? token : `Bearer ${token}` }
          : {}),
      },

      signal,
    }
  );

  if (!response.ok) {
    const mensagem = await response.text();

    throw new Error(
      `Erro ao buscar sexos: ${response.status} ${mensagem}`
    );
  }

  const body = await response.json();

  if (Array.isArray(body)) {
    return body;
  }

  if (Array.isArray(body.data)) {
    return body.data;
  }

  return [];
}
