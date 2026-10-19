import { apiDelete, apiGet, apiPost, apiPut } from "./api";

export type TipoContato = "TELEFONE_FIXO" | "TELEFONE_MOVEL" | "EMAIL";

export type Contato = {
  id_contato: number;
  tipo_contato: TipoContato;
  contato: string;
  principal: boolean;
  ativo: boolean;
};

export type Matricula = {
  id_matricula: number;
  numero: string;
  admissao: string;
  ativo: boolean;
};

export type HistoricoFuncional = {
  id_historico_funcional: number;
  matricula_id: number;
  cargo_id: number;
  funcao_id: number | null;
  departamento_id: number | null;
  tipo_vinculo_id: number;
  situacao_id: number;
  data_inicio: string;
  data_fim: string | null;
};

export type NovoContato = Omit<Contato, "id_contato">;
export type NovaMatricula = Omit<Matricula, "id_matricula">;
export type NovoHistoricoFuncional = Omit<HistoricoFuncional, "id_historico_funcional" | "data_fim"> & {
  data_fim?: string | null;
};

function idSeguro(id: string | number): string {
  const valor = String(id).trim();
  if (!valor) throw new Error("O ID é obrigatório.");
  return encodeURIComponent(valor);
}

function baseServidor(idServidor: string | number): string {
  return `/api/servidores/${idSeguro(idServidor)}`;
}

function normalizarLista<T>(response: unknown): T[] {
  if (Array.isArray(response)) return response as T[];
  if (response && typeof response === "object") {
    const data = (response as { data?: unknown }).data;
    if (Array.isArray(data)) return data as T[];
  }
  throw new Error("A API retornou uma lista em formato inválido.");
}

export async function listarContatos(idServidor: string | number, signal?: AbortSignal): Promise<Contato[]> {
  const response = await apiGet<unknown>(`${baseServidor(idServidor)}/contatos`, { signal });
  return normalizarLista<Contato>(response);
}

export async function criarContato(idServidor: string | number, dados: NovoContato): Promise<unknown> {
  return apiPost(`${baseServidor(idServidor)}/contatos`, dados);
}

export async function atualizarContato(idServidor: string | number, idContato: number, dados: NovoContato): Promise<unknown> {
  return apiPut(`${baseServidor(idServidor)}/contatos/${idSeguro(idContato)}`, dados);
}

export async function excluirContato(idServidor: string | number, idContato: number): Promise<void> {
  await apiDelete(`${baseServidor(idServidor)}/contatos/${idSeguro(idContato)}`);
}

export async function listarMatriculas(idServidor: string | number, signal?: AbortSignal): Promise<Matricula[]> {
  const response = await apiGet<unknown>(`${baseServidor(idServidor)}/matriculas`, { signal });
  return normalizarLista<Matricula>(response);
}

export async function criarMatricula(idServidor: string | number, dados: NovaMatricula): Promise<unknown> {
  return apiPost(`${baseServidor(idServidor)}/matriculas`, dados);
}

export async function atualizarMatricula(idServidor: string | number, idMatricula: number, dados: NovaMatricula): Promise<unknown> {
  return apiPut(`${baseServidor(idServidor)}/matriculas/${idSeguro(idMatricula)}`, dados);
}

export async function excluirMatricula(idServidor: string | number, idMatricula: number): Promise<void> {
  await apiDelete(`${baseServidor(idServidor)}/matriculas/${idSeguro(idMatricula)}`);
}

export async function listarHistoricoFuncional(
  idServidor: string | number,
  idMatricula: number,
  signal?: AbortSignal,
): Promise<HistoricoFuncional[]> {
  const response = await apiGet<unknown>(
    `${baseServidor(idServidor)}/matriculas/${idSeguro(idMatricula)}/historicoFuncional`,
    { signal },
  );
  return normalizarLista<HistoricoFuncional>(response);
}

export async function criarHistoricoFuncional(
  idServidor: string | number,
  idMatricula: number,
  dados: NovoHistoricoFuncional,
): Promise<unknown> {
  return apiPost(
    `${baseServidor(idServidor)}/matriculas/${idSeguro(idMatricula)}/historicoFuncional`,
    dados,
  );
}

export async function atualizarHistoricoFuncional(
  idServidor: string | number,
  idMatricula: number,
  idHistorico: number,
  dados: NovoHistoricoFuncional,
): Promise<unknown> {
  return apiPut(
    `${baseServidor(idServidor)}/matriculas/${idSeguro(idMatricula)}/historicoFuncional/${idSeguro(idHistorico)}`,
    dados,
  );
}

export async function excluirHistoricoFuncional(
  idServidor: string | number,
  idMatricula: number,
  idHistorico: number,
): Promise<void> {
  await apiDelete(
    `${baseServidor(idServidor)}/matriculas/${idSeguro(idMatricula)}/historicoFuncional/${idSeguro(idHistorico)}`,
  );
}
