import type { Servidor } from "./types";

/**
 * URL base da API
 */
const apiUrl = (
  import.meta.env.VITE_API_URL ??
  "https://projeto-rh-sj48.onrender.com"
).replace(/\/$/, "");

/**
 * Endpoint de servidores
 */
const endpoint = `${apiUrl}/api/servidores`;

/**
 * Headers padrão da API
 */
function getHeaders(): HeadersInit {
  const token =
    localStorage.getItem("rh_access_token") ??
    localStorage.getItem("token") ??
    localStorage.getItem("token_access") ??
    "";

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

/**
 * Dados enviados para:
 * POST /api/servidores
 *
 * Campos que possuem relacionamento
 * devem receber o ID correspondente.
 */
export type NovoServidorDados = {
  ativo: boolean;

  nome_completo: string;
  nome_social: string | null;
  cpf: string;
  nis_pis: string | null;
  data_nascimento: string;

  nacionalidade_id: number | null;
  pais_origem_id: number | null;
  ano_chegada_brasil: number | null;
  municipio_nascimento_id: number | null;

  cpf_mae: string | null;
  nome_mae: string | null;
  cpf_pai: string | null;
  nome_pai: string | null;

  estado_civil_id: number | null;
  uniao_estavel: boolean;

  sexo_id: number | null;
  genero_id: number | null;
  racacor_id: number | null;
  comunidade_indigena_id: number | null;

  cep: string | null;
  logradouro: string | null;
  numero: string | null;
  complemento: string | null;
  bairro: string | null;

  municipio_endereco_id: number | null;
  zona_endereco_id: number | null;
  localizacao_diferenciada_id: number | null;

  cartao_sus: string | null;

  situacao_id: number | null;
  escolaridade_id: number | null;
  tipo_ensino_medio_cursado_id: number | null;

  observacao: string | null;
};

/**
 * Resposta de um servidor vindo da API
 */
type ApiServidor = NovoServidorDados & {
  id_servidor: number;
};

/**
 * Resposta da listagem
 */
type ApiListResponse =
  | ApiServidor[]
  | {
      data?: ApiServidor[];
    };

/**
 * Converte o servidor da API para o formato
 * utilizado pelo frontend.
 */
function adaptarServidor(api: ApiServidor): Servidor {
  return {
    id: String(api.id_servidor),

    nome: api.nome_completo,

    matricula: "",

    cargo: "",

    secretaria: "",

    status: api.ativo ? "Ativo" : "Afastado",

    email: "",

    cpf: api.cpf,

    dataNascimento: api.data_nascimento,

    sexoId:
      api.sexo_id != null
        ? String(api.sexo_id)
        : "",

    endereco: api.logradouro ?? "",

    numeroEndereco: api.numero ?? "",

    bairro: api.bairro ?? "",

    telefone: "",
  };
}

/**
 * GET /api/servidores
 */
export async function listarServidores(
  signal?: AbortSignal
): Promise<Servidor[]> {
  const response = await fetch(endpoint, {
    method: "GET",
    headers: getHeaders(),
    signal,
  });

  if (!response.ok) {
    let mensagem =
      `Não foi possível carregar os servidores. Status: ${response.status}`;

    try {
      const erro = await response.json();

      mensagem =
        erro?.mensagem ??
        erro?.message ??
        erro?.erro ??
        erro?.error ??
        mensagem;
    } catch {
      // A API não retornou JSON.
    }

    throw new Error(mensagem);
  }

  const body: ApiListResponse = await response.json();

  const lista = Array.isArray(body)
    ? body
    : body.data ?? [];

  return lista.map(adaptarServidor);
}

/**
 * POST /api/servidores
 */
export async function cadastrarServidor(
  dados: NovoServidorDados
): Promise<ApiServidor> {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(dados),
  });

  if (!response.ok) {
    let mensagem =
      `Erro ao cadastrar servidor. Status: ${response.status}`;

    try {
      const erro = await response.json();

      mensagem =
        erro?.mensagem ??
        erro?.message ??
        erro?.erro ??
        erro?.error ??
        mensagem;
    } catch {
      // A API não retornou JSON.
    }

    throw new Error(mensagem);
  }

  return response.json();
}