import type {
  OperacaoFormulario,
  SchemaFormularioResponse,
} from "../types/json-schema.types";
import { apiGet } from "./api";

export async function buscarSchema(
  dominio: string,
  operacao: OperacaoFormulario,
  idServidor?: string | number
): Promise<SchemaFormularioResponse> {
  const caminho = idServidor === undefined
    ? `/api/${dominio}`
    : `/api/servidores/${encodeURIComponent(String(idServidor))}/${dominio}`;
  const resultado = await apiGet<unknown>(
    `${caminho}/schemas?operacao=${operacao}`,
  );
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