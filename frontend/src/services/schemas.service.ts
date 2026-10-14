import type {
  OperacaoFormulario,
  SchemaFormularioResponse,
} from "../types/json-schema.types";
import { getAuthHeaders } from "./api";

const API_URL = import.meta.env.VITE_API_URL;

export async function buscarSchema(
  dominio: string,
  operacao: OperacaoFormulario,
  idServidor?: string | number
): Promise<SchemaFormularioResponse> {
  const caminho = idServidor === undefined
    ? `/api/${dominio}`
    : `/api/servidores/${encodeURIComponent(String(idServidor))}/${dominio}`;
  const resposta = await fetch(
    `${API_URL}${caminho}/schemas?operacao=${operacao}`,
    {
      method: "GET",
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "application/json",
      },
    }
  );

  if (!resposta.ok) {
    throw new Error(`Erro ao buscar schema: ${resposta.status}`);
  }

  const resultado: unknown = await resposta.json();
  if (
    !resultado ||
    typeof resultado !== "object" ||
    !("schema" in resultado) ||
    !("operacao" in resultado) ||
    resultado.operacao !== operacao
  ) {
    throw new Error("A API retornou um formato inválido para o schema.");
  }

  if (!resultado.schema || typeof resultado.schema !== "object") {
    throw new Error("A API não retornou um schema válido.");
  }

  return resultado as SchemaFormularioResponse;
}