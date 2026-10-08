import { getApiUrl, getAuthHeaders } from "./api";

type ApiOpcao = {
  id?: string | number;
  id_sexo?: string | number;
  descricao?: string | null;
  nome?: string | null;
  titulo?: string | null;
  nome_completo?: string | null;
  ativo?: boolean;
};

export type OpcaoServidor = {
  id: string | number;
  descricao: string;
};

async function listar(
  rota: string,
  signal?: AbortSignal
): Promise<OpcaoServidor[]> {
  const response = await fetch(
    getApiUrl(`/api/${rota}`),
    {
      method: "GET",
      headers: getAuthHeaders(),
      signal,
    }
  );

  if (!response.ok) {
    let mensagem =
      `Erro ao carregar /api/${rota}: ${response.status}`;

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

  const body = await response.json();

  const lista: ApiOpcao[] = Array.isArray(body)
    ? body
    : Array.isArray(body?.data)
      ? body.data
      : [];

  return lista
    .filter((item) => item.ativo !== false)
    .map((item) => ({
      id: item.id ?? item.id_sexo ?? "",
      descricao:
        item.descricao ??
        item.nome ??
        item.titulo ??
        item.nome_completo ??
        String(item.id ?? item.id_sexo ?? ""),
    }));
}

export function listarSexos(
  signal?: AbortSignal
) {
  return listar("sexos", signal);
}

export function listarGeneros(
  signal?: AbortSignal
) {
  return listar("generos", signal);
}

export function listarRacasCor(
  signal?: AbortSignal
) {
  return listar("racaCor", signal);
}

export function listarEstadosCivis(
  signal?: AbortSignal
) {
  return listar("estadoCivil", signal);
}

export function listarCargos(
  signal?: AbortSignal
) {
  return listar("cargo", signal);
}

export function listarDepartamentos(
  signal?: AbortSignal
) {
  return listar("departamento", signal);
}

export function listarTiposVinculo(
  signal?: AbortSignal
) {
  return listar("tipoVinculo", signal);
}

export function listarEscolaridades(
  signal?: AbortSignal
) {
  return listar("escolaridade", signal);
}

export function listarTiposEnsinoMedio(
  signal?: AbortSignal
) {
  return listar(
    "tipoEnsinoMedioCursado",
    signal
  );
}

export function listarZonasEndereco(
  signal?: AbortSignal
) {
  return listar("zonaEndereco", signal);
}

export function listarLocalizacoesDiferenciadas(
  signal?: AbortSignal
) {
  return listar(
    "localizacaoDiferenciada",
    signal
  );
}

export function listarComunidadesIndigenas(
  signal?: AbortSignal
) {
  return listar(
    "comunidadesindigenas",
    signal
  );
}

export function listarSituacoes(
  signal?: AbortSignal
) {
  return listar("situacao", signal);
}