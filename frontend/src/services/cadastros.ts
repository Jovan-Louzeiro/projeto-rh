import { apiDelete, apiGet, apiPatch, apiPost } from "./api";

export type RegistroCadastro = Record<string, unknown>;
export type CampoCadastro = {
  name: string;
  label: string;
  type?: "text" | "email" | "password" | "number" | "checkbox" | "select";
  required?: boolean;
  maxLength?: number;
  options?: { value: string; label: string }[];
  source?: "paises" | "estados";
};
export type RecursoCadastro = {
  group: string;
  label: string;
  path: string;
  idKey: string;
  fields: CampoCadastro[];
};

const ativo: CampoCadastro = { name: "ativo", label: "Ativo", type: "checkbox" };
const descricao = (maxLength = 50): CampoCadastro => ({ name: "descricao", label: "Descrição", required: true, maxLength });
const nome: CampoCadastro = { name: "nome", label: "Nome", required: true, maxLength: 100 };

export const recursosCadastro: RecursoCadastro[] = [
  { group: "Domínios", label: "Comunidades indígenas", path: "comunidadesIndigenas", idKey: "id_comunidade_indigena", fields: [descricao(), ativo] },
  { group: "Domínios", label: "Escolaridade", path: "escolaridade", idKey: "id_escolaridade", fields: [descricao(), ativo] },
  { group: "Domínios", label: "Gêneros", path: "generos", idKey: "id_genero", fields: [descricao(20), ativo] },
  { group: "Domínios", label: "Raça/cor", path: "racacor", idKey: "id_racacor", fields: [descricao(10), ativo] },
  { group: "Domínios", label: "Sexos", path: "sexos", idKey: "id_sexo", fields: [descricao(), ativo] },
  { group: "Domínios", label: "Níveis", path: "nivel", idKey: "id_nivel", fields: [descricao(10), ativo] },
  { group: "Domínios", label: "Estados civis", path: "estadoCivil", idKey: "id_estado_civil", fields: [descricao(15), ativo] },
  { group: "Domínios", label: "Zonas de endereço", path: "zonaEndereco", idKey: "id_zona_endereco", fields: [descricao(10), ativo] },
  { group: "Domínios", label: "Localizações diferenciadas", path: "localizacaoDiferenciada", idKey: "id_localizacao_diferenciada", fields: [descricao(), ativo] },
  { group: "Domínios", label: "Cargos", path: "cargo", idKey: "id_cargo", fields: [descricao(), ativo] },
  { group: "Domínios", label: "Funções", path: "funcao", idKey: "id_funcao", fields: [descricao(), ativo] },
  { group: "Domínios", label: "Departamentos", path: "departamento", idKey: "id_departamento", fields: [descricao(150), { name: "inep", label: "INEP", required: true, maxLength: 50 }, ativo] },
  { group: "Domínios", label: "Tipos de vínculo", path: "tipoVinculo", idKey: "id_tipo_vinculo", fields: [descricao(), ativo] },
  { group: "Domínios", label: "Tipos de ensino médio", path: "tipoEnsinoMedioCursado", idKey: "id_tipo_ensino_medio_cursado", fields: [descricao(), ativo] },
  { group: "Domínios", label: "Situações", path: "situacao", idKey: "id_situacao", fields: [descricao(30), ativo] },
  { group: "Localização", label: "Países", path: "pais", idKey: "id_pais", fields: [nome, { name: "gentilico", label: "Gentílico", required: true, maxLength: 100 }, { name: "codigo_iso", label: "Código ISO", required: true, maxLength: 2 }, ativo] },
  { group: "Localização", label: "Estados", path: "estados", idKey: "id_estado", fields: [nome, { name: "uf", label: "UF", required: true, maxLength: 2 }, { name: "pais_id", label: "País", type: "select", required: true, source: "paises" }, ativo] },
  { group: "Localização", label: "Municípios", path: "municipios", idKey: "id_municipio", fields: [nome, { name: "estado_id", label: "Estado", type: "select", required: true, source: "estados" }, ativo] },
  { group: "Acesso", label: "Usuários", path: "usuarios", idKey: "id_usuario", fields: [
    { name: "nome", label: "Nome", required: true, maxLength: 50 },
    { name: "email", label: "E-mail", type: "email", required: true, maxLength: 50 },
    { name: "senha", label: "Senha", type: "password", required: true },
    { name: "permissao", label: "Permissão", type: "select", required: true, options: [{ value: "ADMIN", label: "Administrador" }, { value: "RH", label: "RH" }] },
    ativo,
  ] },
];

export async function listarRegistrosCadastro(recurso: RecursoCadastro, signal?: AbortSignal): Promise<RegistroCadastro[]> {
  const body = await apiGet<unknown>(`/api/${recurso.path}?mostrarTudo=true`, { signal });
  if (Array.isArray(body)) return body as RegistroCadastro[];
  if (body && typeof body === "object" && Array.isArray((body as { data?: unknown }).data)) return (body as { data: RegistroCadastro[] }).data;
  return [];
}

export async function criarRegistroCadastro(recurso: RecursoCadastro, dados: RegistroCadastro) {
  return apiPost<unknown>(`/api/${recurso.path}`, dados);
}

export async function atualizarRegistroCadastro(recurso: RecursoCadastro, id: string | number, dados: RegistroCadastro) {
  return apiPatch<unknown>(`/api/${recurso.path}/${encodeURIComponent(String(id))}`, dados);
}

export async function excluirRegistroCadastro(recurso: RecursoCadastro, id: string | number) {
  return apiDelete<unknown>(`/api/${recurso.path}/${encodeURIComponent(String(id))}`);
}

