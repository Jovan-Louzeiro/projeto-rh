import {
  apiDelete,
  apiGet,
  apiPatch,
  apiPost,
} from "./api";
import type { Servidor as ServidorTela } from "../types";

/* =========================================================
   TIPOS
   ========================================================= */

export type Servidor = {
  id_servidor: number | string;

  ativo?: boolean;

  nome_completo: string;

  cpf?: string | null;
  rg?: string | null;

  data_nascimento?: string | null;

  nacionalidade_id?: number | string | null;
  nome_mae?: string | null;
  nome_pai?: string | null;

  sexo_id?: number | string | null;
  racacor_id?: number | string | null;
  genero_id?: number | string | null;
  estado_civil_id?: number | string | null;

  cep?: string | null;
  logradouro?: string | null;
  numero?: string | null;
  complemento?: string | null;
  bairro?: string | null;

  municipio_endereco_id?: number | string | null;
  zona_endereco_id?: number | string | null;

  situacao_id?: number | string | null;

  cargo_id?: number | string | null;
  departamento_id?: number | string | null;

  tipo_vinculo_id?: number | string | null;

  data_admissao?: string | null;

  escolaridade_id?: number | string | null;
  tipo_ensino_medio_id?: number | string | null;

  localizacao_diferenciada_id?: number | string | null;
  comunidade_indigena_id?: number | string | null;

  [key: string]: unknown;
};


/* =========================================================
   DADOS PARA CADASTRO
   ========================================================= */

export type NovoServidorDados = {
  nome_completo: string;

  cpf?: string;
  rg?: string;

  data_nascimento?: string;

  nacionalidade_id?: number | string;
  nome_mae?: string;
  nome_pai?: string;

  sexo_id?: number | string;
  racacor_id?: number | string;
  genero_id?: number | string;
  estado_civil_id?: number | string;

  cep?: string;
  logradouro?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;

  municipio_endereco_id?: number | string;
  zona_endereco_id?: number | string;

  situacao_id?: number | string;

  cargo_id?: number | string;
  departamento_id?: number | string;

  tipo_vinculo_id?: number | string;

  data_admissao?: string;

  escolaridade_id?: number | string;
  tipo_ensino_medio_id?: number | string;

  localizacao_diferenciada_id?: number | string;
  comunidade_indigena_id?: number | string;

  [key: string]: unknown;
};


/* =========================================================
   RESPOSTA PAGINADA
   ========================================================= */

export type ListaServidoresResponse = {
  data?: Servidor[];

  servidores?: Servidor[];

  items?: Servidor[];

  total?: number;

  page?: number;

  limit?: number;

  [key: string]: unknown;
};


/* =========================================================
   NORMALIZAÇÃO DE LISTA
   ========================================================= */

/**
 * O backend pode retornar:
 *
 * [
 *   servidor,
 *   servidor
 * ]
 *
 * ou:
 *
 * {
 *   data: [...]
 * }
 *
 * ou:
 *
 * {
 *   servidores: [...]
 * }
 *
 * Esta função deixa o frontend preparado para
 * essas diferentes estruturas.
 */
function normalizarLista(
  response: unknown,
): Servidor[] {
  if (Array.isArray(response)) {
    return response as Servidor[];
  }

  if (
    response &&
    typeof response === "object"
  ) {
    const body = response as ListaServidoresResponse;

    if (Array.isArray(body.data)) {
      return body.data;
    }

    if (Array.isArray(body.servidores)) {
      return body.servidores;
    }

    if (Array.isArray(body.items)) {
      return body.items;
    }
  }

  return [];
}


/* =========================================================
   NORMALIZAÇÃO DE ID
   ========================================================= */

function normalizarId(
  idServidor: number | string,
): string {
  const id = String(idServidor).trim();

  if (!id) {
    throw new Error(
      "O ID do servidor é obrigatório.",
    );
  }

  return encodeURIComponent(id);
}


/* =========================================================
   LISTAR SERVIDORES
   ========================================================= */

export async function listarServidores(
  signal?: AbortSignal,
): Promise<ServidorTela[]> {
  const response = await apiGet<unknown>(
    "/api/servidores",
    {
      signal,
    },
  );

  return normalizarLista(response).map(adaptarServidor);
}

export function adaptarServidor(item: Servidor): ServidorTela {
  const raw = item as Servidor & Record<string, unknown>;
  const id = String(raw.id_servidor ?? raw.id ?? "");
  const descricao = (valor: unknown) => valor && typeof valor === "object"
    ? (valor as Record<string, unknown>).descricao
    : undefined;
  return {
    id,
    nome: raw.nome_completo ?? "",
    matricula: String(raw.matricula ?? id),
    cargo: String(descricao(raw.cargo) ?? raw.cargo_descricao ?? "Não informado"),
    secretaria: String(descricao(raw.departamento) ?? raw.departamento_descricao ?? "Não informado"),
    status: String(descricao(raw.situacao) ?? (raw.ativo === false ? "Inativo" : "Ativo")) as ServidorTela["status"],
    email: String(raw.email ?? ""),
    cpf: raw.cpf ?? undefined,
    dataNascimento: raw.data_nascimento ?? undefined,
    dataAdmissao: raw.data_admissao ?? undefined,
    endereco: raw.logradouro ?? undefined,
    numeroEndereco: raw.numero ?? undefined,
    bairro: raw.bairro ?? undefined,
    sexoId: raw.sexo_id ?? undefined,
  };
}


/* =========================================================
   BUSCAR SERVIDOR POR ID
   ========================================================= */

export async function buscarServidor(
  idServidor: number | string,
  signal?: AbortSignal,
): Promise<Servidor> {
  const id = normalizarId(idServidor);

  return apiGet<Servidor>(
    `/api/servidores/${id}`,
    {
      signal,
    },
  );
}


/* =========================================================
   CADASTRAR SERVIDOR
   ========================================================= */

export async function cadastrarServidor(
  dados: NovoServidorDados,
): Promise<Servidor> {
  return apiPost<Servidor>(
    "/api/servidores",
    dados,
  );
}


/* =========================================================
   ATUALIZAR SERVIDOR
   ========================================================= */

export async function atualizarServidor(
  idServidor: number | string,
  dados: Partial<NovoServidorDados>,
): Promise<Servidor> {
  const id = normalizarId(idServidor);

  return apiPatch<Servidor>(
    `/api/servidores/${id}`,
    dados,
  );
}


/* =========================================================
   EXCLUIR SERVIDOR
   ========================================================= */

export async function excluirServidor(
  idServidor: number | string,
): Promise<void> {
  const id = normalizarId(idServidor);

  await apiDelete(
    `/api/servidores/${id}`,
  );
}


/* =========================================================
   ATIVAR SERVIDOR
   ========================================================= */

export async function ativarServidor(
  idServidor: number | string,
): Promise<Servidor> {
  return atualizarServidor(
    idServidor,
    {
      ativo: true,
    },
  );
}


/* =========================================================
   DESATIVAR SERVIDOR
   ========================================================= */

export async function desativarServidor(
  idServidor: number | string,
): Promise<Servidor> {
  return atualizarServidor(
    idServidor,
    {
      ativo: false,
    },
  );
}


/* =========================================================
   DETALHES / DOCUMENTOS
   ========================================================= */

export type DetalhesServidor = {
  servidor?: Servidor;

  documentos?: unknown[];

  [key: string]: unknown;
};


/**
 * Busca os dados detalhados do servidor.
 *
 * Essa rota será utilizada posteriormente
 * pela tela PerfilServidor.
 */
export async function detalharServidor(
  idServidor: number | string,
  signal?: AbortSignal,
): Promise<DetalhesServidor> {
  const id = normalizarId(idServidor);

  return apiGet<DetalhesServidor>(
    `/api/servidores/${id}/detalharDocumentos`,
    {
      signal,
    },
  );
}
