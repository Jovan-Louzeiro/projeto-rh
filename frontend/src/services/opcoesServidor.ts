import { apiGet } from "./api";

type ApiOpcao = Record<string, unknown> & {
  descricao?: string | null;
  nome?: string | null;
  titulo?: string | null;
  nome_completo?: string | null;
  ativo?: boolean;
};

export type OpcaoServidor = { id: string | number; descricao: string };

const chavesId = [
  "id", "id_sexo", "id_genero", "id_racacor", "id_estado_civil", "id_cargo",
  "id_departamento", "id_tipo_vinculo", "id_escolaridade",
  "id_tipo_ensino_medio_cursado", "id_zona_endereco",
  "id_localizacao_diferenciada", "id_comunidade_indigena", "id_situacao",
];

async function listar(rota: string, signal?: AbortSignal): Promise<OpcaoServidor[]> {
  const body = await apiGet<unknown>(`/api/${rota}`, { signal });
  const lista = Array.isArray(body)
    ? body as ApiOpcao[]
    : body && typeof body === "object" && Array.isArray((body as { data?: unknown }).data)
      ? (body as { data: ApiOpcao[] }).data
      : [];

  return lista.filter(item => item.ativo !== false).map(item => {
    const id = chavesId.map(chave => item[chave]).find(valor => typeof valor === "string" || typeof valor === "number") ?? "";
    const descricao = item.descricao ?? item.nome ?? item.titulo ?? item.nome_completo ?? String(id);
    return { id: id as string | number, descricao: String(descricao) };
  });
}

export const listarSexos = (signal?: AbortSignal) => listar("sexos", signal);
export const listarGeneros = (signal?: AbortSignal) => listar("generos", signal);
export const listarRacasCor = (signal?: AbortSignal) => listar("racacor", signal);
export const listarEstadosCivis = (signal?: AbortSignal) => listar("estadoCivil", signal);
export const listarCargos = (signal?: AbortSignal) => listar("cargo", signal);
export const listarDepartamentos = (signal?: AbortSignal) => listar("departamento", signal);
export const listarTiposVinculo = (signal?: AbortSignal) => listar("tipoVinculo", signal);
export const listarEscolaridades = (signal?: AbortSignal) => listar("escolaridade", signal);
export const listarTiposEnsinoMedio = (signal?: AbortSignal) => listar("tipoEnsinoMedioCursado", signal);
export const listarZonasEndereco = (signal?: AbortSignal) => listar("zonaEndereco", signal);
export const listarLocalizacoesDiferenciadas = (signal?: AbortSignal) => listar("localizacaoDiferenciada", signal);
export const listarComunidadesIndigenas = (signal?: AbortSignal) => listar("comunidadesIndigenas", signal);
export const listarSituacoes = (signal?: AbortSignal) => listar("situacao", signal);

export type OpcoesServidorCompletas = {
  sexos: OpcaoServidor[];
  generos: OpcaoServidor[];
  racasCor: OpcaoServidor[];
  estadosCivis: OpcaoServidor[];
  cargos: OpcaoServidor[];
  departamentos: OpcaoServidor[];
  tiposVinculo: OpcaoServidor[];
  escolaridades: OpcaoServidor[];
  tiposEnsinoMedio: OpcaoServidor[];
  zonasEndereco: OpcaoServidor[];
  localizacoesDiferenciadas: OpcaoServidor[];
  comunidadesIndigenas: OpcaoServidor[];
  situacoes: OpcaoServidor[];
};

export async function carregarOpcoesServidor(signal?: AbortSignal): Promise<OpcoesServidorCompletas> {
  const [sexos, generos, racasCor, estadosCivis, cargos, departamentos, tiposVinculo,
    escolaridades, tiposEnsinoMedio, zonasEndereco, localizacoesDiferenciadas,
    comunidadesIndigenas, situacoes] = await Promise.all([
    listarSexos(signal), listarGeneros(signal), listarRacasCor(signal), listarEstadosCivis(signal),
    listarCargos(signal), listarDepartamentos(signal), listarTiposVinculo(signal),
    listarEscolaridades(signal), listarTiposEnsinoMedio(signal), listarZonasEndereco(signal),
    listarLocalizacoesDiferenciadas(signal), listarComunidadesIndigenas(signal), listarSituacoes(signal),
  ]);
  return { sexos, generos, racasCor, estadosCivis, cargos, departamentos, tiposVinculo,
    escolaridades, tiposEnsinoMedio, zonasEndereco, localizacoesDiferenciadas,
    comunidadesIndigenas, situacoes };
}
