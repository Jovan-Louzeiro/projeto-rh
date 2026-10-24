import { Fragment, useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import type { Servidor } from "../types";
import { excluirServidor, listarServidores } from "../services/servidores";
import { carregarOpcoesServidor, type OpcoesServidorCompletas } from "../services/opcoesServidor";
import { carregarDadosGeograficos, type DadosGeograficos } from "../services/localizacao";
import Icon from "../components/Icon";
import Status from "../components/Status";

type Props = {
  onProfile: (servidor: Servidor) => void;
  onEdit: (servidor: Servidor) => void;
  onNew: () => void;
};

type CampoServidor = {
  chave: string;
  rotulo: string;
  tipo: "text" | "date" | "boolean" | "select";
};

type CampoFiltroServidor = CampoServidor & {
  escopo: "servidor" | "matriculas" | "historicos_funcionais";
  localOnly?: boolean;
};

type FiltroServidor = {
  id: number;
  escopo: CampoFiltroServidor["escopo"];
  campo: string;
  valor: string;
};

type OpcaoFiltro = { valor: string; descricao: string };
type OrdenacaoServidor = { campo: string; direcao: "asc" | "desc" };

const camposServidor: CampoServidor[] = [
  { chave: "id_servidor", rotulo: "Servidor", tipo: "select" },
  { chave: "ativo", rotulo: "Ativo", tipo: "boolean" },
  { chave: "nome_completo", rotulo: "Nome completo", tipo: "text" },
  { chave: "nome_social", rotulo: "Nome social", tipo: "text" },
  { chave: "cpf", rotulo: "CPF", tipo: "text" },
  { chave: "nis_pis", rotulo: "NIS / PIS", tipo: "text" },
  { chave: "data_nascimento", rotulo: "Data de nascimento", tipo: "date" },
  { chave: "nacionalidade_id", rotulo: "Nacionalidade", tipo: "select" },
  { chave: "pais_origem_id", rotulo: "País de origem", tipo: "select" },
  { chave: "ano_chegada_brasil", rotulo: "Ano de chegada ao Brasil", tipo: "text" },
  { chave: "municipio_nascimento_id", rotulo: "Município de nascimento", tipo: "select" },
  { chave: "cpf_mae", rotulo: "CPF da mãe", tipo: "text" },
  { chave: "nome_mae", rotulo: "Nome da mãe", tipo: "text" },
  { chave: "cpf_pai", rotulo: "CPF do pai", tipo: "text" },
  { chave: "nome_pai", rotulo: "Nome do pai", tipo: "text" },
  { chave: "estado_civil_id", rotulo: "Estado civil", tipo: "select" },
  { chave: "uniao_estavel", rotulo: "União estável", tipo: "boolean" },
  { chave: "sexo_id", rotulo: "Sexo", tipo: "select" },
  { chave: "genero_id", rotulo: "Gênero", tipo: "select" },
  { chave: "racacor_id", rotulo: "Raça / cor", tipo: "select" },
  { chave: "comunidade_indigena_id", rotulo: "Comunidade indígena", tipo: "select" },
  { chave: "cep", rotulo: "CEP", tipo: "text" },
  { chave: "logradouro", rotulo: "Logradouro", tipo: "text" },
  { chave: "numero", rotulo: "Número", tipo: "text" },
  { chave: "complemento", rotulo: "Complemento", tipo: "text" },
  { chave: "bairro", rotulo: "Bairro", tipo: "text" },
  { chave: "municipio_endereco_id", rotulo: "Município de endereço", tipo: "select" },
  { chave: "zona_endereco_id", rotulo: "Zona de endereço", tipo: "select" },
  { chave: "localizacao_diferenciada_id", rotulo: "Localização diferenciada", tipo: "select" },
  { chave: "cartao_sus", rotulo: "Cartão SUS", tipo: "text" },
  { chave: "situacao_id", rotulo: "Situação", tipo: "select" },
  { chave: "escolaridade_id", rotulo: "Escolaridade", tipo: "select" },
  { chave: "tipo_ensino_medio_cursado_id", rotulo: "Tipo de ensino médio", tipo: "select" },
  { chave: "observacao", rotulo: "Observação", tipo: "text" },
];

const camposRelacionados: CampoServidor[] = [
  { chave: "tipo_vinculo_atual", rotulo: "Tipo de vínculo", tipo: "select" },
  { chave: "admissao_matricula", rotulo: "Admissão", tipo: "date" },
  { chave: "cargo_historico_atual", rotulo: "Cargo", tipo: "select" },
  { chave: "funcao_historico_atual", rotulo: "Função", tipo: "select" },
  { chave: "departamento_historico_atual", rotulo: "Departamento", tipo: "select" },
  { chave: "situacao_historico_atual", rotulo: "Situação funcional", tipo: "select" },
  { chave: "inicio_historico_atual", rotulo: "Início", tipo: "date" },
];

const camposFiltroServidor: CampoFiltroServidor[] = [
  ...camposServidor.map(campo => ({
    ...campo,
    escopo: "servidor" as const,
    localOnly: campo.chave === "ativo" || campo.chave === "numero",
  })),
  { escopo: "matriculas", chave: "matricula_numero", rotulo: "Número da matrícula", tipo: "text", localOnly: true },
  { escopo: "matriculas", chave: "admissao", rotulo: "Data de admissão", tipo: "date" },
  { escopo: "matriculas", chave: "tipo_vinculo_id", rotulo: "Tipo de vínculo", tipo: "select" },
  { escopo: "historicos_funcionais", chave: "cargo_id", rotulo: "Cargo", tipo: "select" },
  { escopo: "historicos_funcionais", chave: "funcao_id", rotulo: "Função", tipo: "select" },
  { escopo: "historicos_funcionais", chave: "departamento_id", rotulo: "Departamento", tipo: "select" },
  { escopo: "historicos_funcionais", chave: "situacao_historico_funcional_id", rotulo: "Situação funcional", tipo: "select" },
  { escopo: "historicos_funcionais", chave: "data_inicio", rotulo: "Início", tipo: "date" },
  { escopo: "historicos_funcionais", chave: "data_fim", rotulo: "Término", tipo: "date" },
];

const camposVisiveisIniciais = ["cpf", "funcao_historico_atual"];
const opcoesServidorVazias: OpcoesServidorCompletas = {
  sexos: [], generos: [], racasCor: [], estadosCivis: [], cargos: [], funcoes: [],
  departamentos: [], tiposVinculo: [], escolaridades: [], tiposEnsinoMedio: [],
  zonasEndereco: [], localizacoesDiferenciadas: [], comunidadesIndigenas: [], situacoes: [],
};
const dadosGeograficosVazios: DadosGeograficos = { paises: [], estados: [], municipios: [] };

const formatarCpf = (cpf?: string) => {
  const numeros = (cpf ?? "").replace(/\D/g, "");
  return numeros.length === 11
    ? `${numeros.slice(0, 3)}.${numeros.slice(3, 6)}.${numeros.slice(6, 9)}-${numeros.slice(9)}`
    : cpf || "—";
};

const formatarData = (valor: unknown) => {
  if (!valor) return "—";
  const data = String(valor).slice(0, 10);
  const correspondencia = /^(\d{4})-(\d{2})-(\d{2})$/.exec(data);
  return correspondencia
    ? `${correspondencia[3]}-${correspondencia[2]}-${correspondencia[1]}`
    : data;
};

const iniciais = (nome: string) =>
  nome.trim().split(/\s+/).slice(0, 2).map(parte => parte[0]).join("").toUpperCase();

const normalizarValorFiltro = (campo: string, valor: unknown) => {
  if (valor === null || valor === undefined) return "";
  if (["cpf", "cpf_mae", "cpf_pai", "nis_pis", "cep", "cartao_sus"].includes(campo)) {
    return String(valor).replace(/\D/g, "");
  }
  if (campo === "data_nascimento") return String(valor).slice(0, 10);
  if (typeof valor === "boolean") return String(valor);
  return String(valor).trim().toLocaleLowerCase();
};

const mostrarCampo = (campo: CampoServidor, valor: unknown, opcoes: OpcaoFiltro[]) => {
  if (valor === null || valor === undefined || valor === "") return "—";
  if (campo.tipo === "select") {
    return opcoes.find(opcao => opcao.valor === String(valor))?.descricao ?? "Não informado";
  }
  if (typeof valor === "boolean") return valor ? "Sim" : "Não";
  if (campo.chave === "cpf" || campo.chave === "cpf_mae" || campo.chave === "cpf_pai") {
    return formatarCpf(String(valor));
  }
  if (campo.tipo === "date") return formatarData(valor);
  return String(valor);
};

const descricaoRelacionada = (valor: unknown) => {
  if (!valor || typeof valor !== "object") return "";
  const relacao = valor as Record<string, unknown>;
  const descricao = relacao.descricao ?? relacao.nome ?? relacao.titulo;
  return typeof descricao === "string" ? descricao : "";
};

const listaMatriculas = (servidor: Servidor): Record<string, unknown>[] =>
  Array.isArray(servidor.matriculas)
    ? servidor.matriculas as Record<string, unknown>[]
    : [];

const historicoFuncionalAtual = (matricula: Record<string, unknown>) => {
  const historicos = Array.isArray(matricula.historicos_funcionais)
    ? matricula.historicos_funcionais as Record<string, unknown>[]
    : [];
  return historicos
    .filter(historico => historico.data_fim === null || historico.data_fim === undefined || historico.data_fim === "")
    .sort((a, b) => String(b.data_inicio ?? "").localeCompare(String(a.data_inicio ?? "")))[0];
};

const formatarDataRelacionada = formatarData;

function escolherHistorico(
  matricula: Record<string, unknown>,
  filtros: FiltroServidor[],
): Record<string, unknown> | undefined {
  const historicos = Array.isArray(matricula.historicos_funcionais)
    ? matricula.historicos_funcionais as Record<string, unknown>[]
    : [];
  const filtrosHistorico = filtros.filter(filtro => filtro.escopo === "historicos_funcionais");
  return historicos
    .filter(historico => filtrosHistorico.length
      ? filtrosHistorico.every(filtro => correspondeFiltro(historico[filtro.campo], filtro))
      : historico.data_fim === null || historico.data_fim === undefined || historico.data_fim === "",
    )
    .sort((a, b) => String(b.data_inicio ?? "").localeCompare(String(a.data_inicio ?? "")))[0];
}

function correspondeFiltro(valor: unknown, filtro: FiltroServidor): boolean {
  const normalizado = (item: unknown) =>
    ["admissao", "data_inicio", "data_fim"].includes(filtro.campo) && item
      ? String(item).slice(0, 10)
      : normalizarValorFiltro(filtro.campo, item);
  return normalizado(valor) === normalizado(filtro.valor);
}

function escolherMatricula(
  servidor: Servidor,
  filtros: FiltroServidor[],
): { matricula?: Record<string, unknown>; historico?: Record<string, unknown> } {
  const matriculas = listaMatriculas(servidor);
  const filtrosMatricula = filtros.filter(filtro => filtro.escopo === "matriculas");
  const filtrosHistorico = filtros.filter(filtro => filtro.escopo === "historicos_funcionais");

  const candidatas = matriculas.flatMap(matricula => {
    if (!filtrosMatricula.every(filtro => correspondeFiltro(
      filtro.campo === "matricula_numero" ? matricula.numero : matricula[filtro.campo],
      filtro,
    ))) return [];

    const historico = escolherHistorico(matricula, filtros);

    if (filtrosHistorico.length && !historico) return [];
    return [{ matricula, historico }];
  });

  candidatas.sort((a, b) => {
    if (filtrosHistorico.length) {
      const comparacaoData = String(b.historico?.data_inicio ?? "")
        .localeCompare(String(a.historico?.data_inicio ?? ""));
      if (comparacaoData) return comparacaoData;
    }
    return Number(b.matricula.ativo === true) - Number(a.matricula.ativo === true);
  });

  if (candidatas.length) return candidatas[0];
  const padrao = matriculas.find(matricula => matricula.ativo === true) ?? matriculas[0];
  return { matricula: padrao, historico: padrao ? historicoFuncionalAtual(padrao) : undefined };
}

function obterValorMatricula(
  matricula: Record<string, unknown>,
  campo: CampoServidor,
  historicoSelecionado?: Record<string, unknown>,
): unknown {
  if (campo.chave === "tipo_vinculo_atual") {
    return matricula.tipo_vinculo ?? matricula.tipo_vinculo_id;
  }
  if (campo.chave === "admissao_matricula") return matricula.admissao;

  const historico = historicoSelecionado ?? historicoFuncionalAtual(matricula);
  if (!historico) return null;

  const valores: Record<string, unknown> = {
    cargo_historico_atual: historico.cargo ?? historico.cargo_id,
    funcao_historico_atual: historico.funcao ?? historico.funcao_id,
    departamento_historico_atual: historico.departamento ?? historico.departamento_id,
    situacao_historico_atual: historico.situacao ?? historico.situacao_historico_funcional_id,
    inicio_historico_atual: historico.data_inicio,
  };
  return valores[campo.chave] ?? null;
}

function obterValorExibicao(
  servidor: Servidor,
  campo: CampoServidor,
  filtros: FiltroServidor[],
): unknown {
  const { matricula, historico } = escolherMatricula(servidor, filtros);

  const valoresRelacionados: Record<string, unknown> = {
    tipo_vinculo_atual: matricula?.tipo_vinculo_id ?? matricula?.tipo_vinculo,
    admissao_matricula: matricula?.admissao,
    cargo_historico_atual: historico?.cargo_id ?? historico?.cargo,
    funcao_historico_atual: historico?.funcao_id ?? historico?.funcao,
    departamento_historico_atual: historico?.departamento_id ?? historico?.departamento,
    situacao_historico_atual: historico?.situacao_historico_funcional_id ?? historico?.situacao,
    inicio_historico_atual: historico?.data_inicio,
  };

  return campo.chave in valoresRelacionados ? valoresRelacionados[campo.chave] : servidor[campo.chave];
}

export function Servidores({ onProfile, onEdit, onNew }: Props) {
  const [servidores, setServidores] = useState<Servidor[]>([]);
  const [opcoesServidor, setOpcoesServidor] = useState(opcoesServidorVazias);
  const [geografia, setGeografia] = useState(dadosGeograficosVazios);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("Todos");
  const [ordenacao, setOrdenacao] = useState<OrdenacaoServidor>({ campo: "nome", direcao: "asc" });
  const [camposVisiveis, setCamposVisiveis] = useState(camposVisiveisIniciais);
  const [filtrosRascunho, setFiltrosRascunho] = useState<FiltroServidor[]>([]);
  const [filtrosAplicados, setFiltrosAplicados] = useState<FiltroServidor[]>([]);
  const [proximoFiltroId, setProximoFiltroId] = useState(0);
  const [excluindo, setExcluindo] = useState<string | null>(null);
  const [servidorExpandido, setServidorExpandido] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState("");

  async function carregarServidores(
    signal?: AbortSignal,
    filtros: FiltroServidor[] = [],
    carregarDependencias = false,
  ) {
    try {
      setLoading(true);
      setErro("");
      const filtrosApi = Object.fromEntries(
        filtros
          .filter(filtro => !camposFiltroServidor.find(campo =>
            campo.escopo === filtro.escopo && campo.chave === filtro.campo,
          )?.localOnly)
          .map(filtro => [filtro.campo, filtro.valor]),
      );
      const listaPromise = listarServidores(signal, { filtros: filtrosApi });
      const dependenciasPromise = carregarDependencias
        ? Promise.all([carregarOpcoesServidor(signal), carregarDadosGeograficos(signal)])
        : Promise.resolve(null);
      const [lista, dependencias] = await Promise.all([listaPromise, dependenciasPromise]);
      setServidores(lista);
      if (dependencias) {
        setOpcoesServidor(dependencias[0]);
        setGeografia(dependencias[1]);
      }
    } catch (error) {
      if (signal?.aborted) return;
      console.error(error);
      setServidores([]);
      setErro(error instanceof Error ? error.message : "Não foi possível carregar os servidores.");
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }

  useEffect(() => {
    const controller = new AbortController();
    void carregarServidores(controller.signal, [], true);
    return () => controller.abort();
  }, []);

  const filtrados = useMemo(() => {
    const termo = busca.trim().toLocaleLowerCase();
    return servidores.filter(servidor => {
      const correspondeBusca = !termo || [
        servidor.nome,
        servidor.id,
        servidor.matricula,
        servidor.cpf,
      ].some(valor => valor?.toLocaleLowerCase().includes(termo));
      const ativo = servidor.ativo === true;
      const correspondeStatus = filtroStatus === "Todos"
        || (filtroStatus === "Ativos" && ativo)
        || (filtroStatus === "Inativos" && !ativo);
      const correspondeFiltros = filtrosAplicados.every(filtro => {
        const campo = camposFiltroServidor.find(item =>
          item.escopo === filtro.escopo && item.chave === filtro.campo,
        );
        if (!campo?.localOnly) return true;
        if (filtro.escopo === "matriculas") {
          const matriculas = Array.isArray(servidor.matriculas)
            ? servidor.matriculas as Record<string, unknown>[]
            : [];
          return matriculas.some(matricula =>
            normalizarValorFiltro(filtro.campo, matricula.numero)
              === normalizarValorFiltro(filtro.campo, filtro.valor),
          );
        }
        return normalizarValorFiltro(filtro.campo, servidor[filtro.campo])
          === normalizarValorFiltro(filtro.campo, filtro.valor);
      });
      return correspondeBusca && correspondeStatus && correspondeFiltros;
    });
  }, [servidores, busca, filtroStatus, filtrosAplicados]);

  const ativos = servidores.filter(servidor => servidor.ativo === true).length;
  const camposDeExibicao = [
    ...camposServidor.filter(campo => campo.chave !== "nome_completo"),
    ...camposRelacionados,
  ];
  const gruposCamposExibicao = [
    {
      titulo: "Servidor",
      campos: camposDeExibicao.filter(campo =>
        camposServidor.some(item => item.chave === campo.chave) && campo.chave !== "nome_completo",
      ),
    },
    {
      titulo: "Matrícula",
      campos: camposRelacionados.filter(campo =>
        campo.chave === "tipo_vinculo_atual" || campo.chave === "admissao_matricula",
      ),
    },
    {
      titulo: "Dados funcionais",
      campos: camposRelacionados.filter(campo =>
        campo.chave !== "tipo_vinculo_atual" && campo.chave !== "admissao_matricula",
      ),
    },
  ];
  const colunasAdicionais = camposDeExibicao.filter(campo => camposVisiveis.includes(campo.chave));
  const opcoesGeograficas = (itens: { id: number; nome: string }[]): OpcaoFiltro[] =>
    itens.map(item => ({ valor: String(item.id), descricao: item.nome }));
  const opcoesMunicipios: OpcaoFiltro[] = geografia.municipios.map(municipio => {
    const estado = geografia.estados.find(item => item.id_estado === municipio.estado_id);
    return {
      valor: String(municipio.id_municipio),
      descricao: estado ? `${municipio.nome} - ${estado.uf}` : municipio.nome,
    };
  });
  const opcoesPorCampo: Record<string, OpcaoFiltro[]> = {
    id_servidor: servidores.map(servidor => ({
      valor: servidor.id,
      descricao: `${servidor.nome}${servidor.matricula ? ` — Matrícula ${servidor.matricula}` : ""}`,
    })),
    nacionalidade_id: opcoesGeograficas(geografia.paises.map(pais => ({ id: pais.id_pais, nome: pais.nome }))),
    pais_origem_id: opcoesGeograficas(geografia.paises.map(pais => ({ id: pais.id_pais, nome: pais.nome }))),
    municipio_nascimento_id: opcoesMunicipios,
    municipio_endereco_id: opcoesMunicipios,
    estado_civil_id: opcoesServidor.estadosCivis.map(opcao => ({ valor: String(opcao.id), descricao: opcao.descricao })),
    sexo_id: opcoesServidor.sexos.map(opcao => ({ valor: String(opcao.id), descricao: opcao.descricao })),
    genero_id: opcoesServidor.generos.map(opcao => ({ valor: String(opcao.id), descricao: opcao.descricao })),
    racacor_id: opcoesServidor.racasCor.map(opcao => ({ valor: String(opcao.id), descricao: opcao.descricao })),
    comunidade_indigena_id: opcoesServidor.comunidadesIndigenas.map(opcao => ({ valor: String(opcao.id), descricao: opcao.descricao })),
    zona_endereco_id: opcoesServidor.zonasEndereco.map(opcao => ({ valor: String(opcao.id), descricao: opcao.descricao })),
    localizacao_diferenciada_id: opcoesServidor.localizacoesDiferenciadas.map(opcao => ({ valor: String(opcao.id), descricao: opcao.descricao })),
    situacao_id: opcoesServidor.situacoes.map(opcao => ({ valor: String(opcao.id), descricao: opcao.descricao })),
    situacao_historico_funcional_id: opcoesServidor.situacoes.map(opcao => ({ valor: String(opcao.id), descricao: opcao.descricao })),
    tipo_vinculo_id: opcoesServidor.tiposVinculo.map(opcao => ({ valor: String(opcao.id), descricao: opcao.descricao })),
    tipo_vinculo_atual: opcoesServidor.tiposVinculo.map(opcao => ({ valor: String(opcao.id), descricao: opcao.descricao })),
    cargo_historico_atual: opcoesServidor.cargos.map(opcao => ({ valor: String(opcao.id), descricao: opcao.descricao })),
    funcao_historico_atual: opcoesServidor.funcoes.map(opcao => ({ valor: String(opcao.id), descricao: opcao.descricao })),
    departamento_historico_atual: opcoesServidor.departamentos.map(opcao => ({ valor: String(opcao.id), descricao: opcao.descricao })),
    situacao_historico_atual: opcoesServidor.situacoes.map(opcao => ({ valor: String(opcao.id), descricao: opcao.descricao })),
    cargo_id: opcoesServidor.cargos.map(opcao => ({ valor: String(opcao.id), descricao: opcao.descricao })),
    funcao_id: opcoesServidor.funcoes.map(opcao => ({ valor: String(opcao.id), descricao: opcao.descricao })),
    departamento_id: opcoesServidor.departamentos.map(opcao => ({ valor: String(opcao.id), descricao: opcao.descricao })),
    escolaridade_id: opcoesServidor.escolaridades.map(opcao => ({ valor: String(opcao.id), descricao: opcao.descricao })),
    tipo_ensino_medio_cursado_id: opcoesServidor.tiposEnsinoMedio.map(opcao => ({ valor: String(opcao.id), descricao: opcao.descricao })),
  };
  const ordenados = [...filtrados].sort((a, b) => {
    const valorOrdenacao = (servidor: Servidor) => {
      if (ordenacao.campo === "situacao") return servidor.status;
      const campo = camposDeExibicao.find(item => item.chave === ordenacao.campo);
      const valor = campo
        ? obterValorExibicao(servidor, campo, filtrosAplicados)
        : servidor[ordenacao.campo];
      if (valor === null || valor === undefined || valor === "") return null;
      const opcao = (opcoesPorCampo[ordenacao.campo] ?? [])
        .find(item => item.valor === String(valor));
      return opcao?.descricao ?? valor;
    };
    const valorA = valorOrdenacao(a);
    const valorB = valorOrdenacao(b);
    if (valorA === null) return valorB === null ? 0 : 1;
    if (valorB === null) return -1;
    const comparacao = String(valorA).localeCompare(String(valorB), "pt-BR", {
      numeric: true,
      sensitivity: "base",
    });
    return ordenacao.direcao === "asc" ? comparacao : -comparacao;
  });

  function alternarOrdenacao(campo: string) {
    setOrdenacao(atual => ({
      campo,
      direcao: atual.campo === campo && atual.direcao === "asc" ? "desc" : "asc",
    }));
  }

  function cabecalhoOrdenavel(rotulo: string, campo: string) {
    const ativo = ordenacao.campo === campo;
    return (
      <th key={campo} aria-sort={ativo ? ordenacao.direcao === "asc" ? "ascending" : "descending" : "none"}>
        <button
          type="button"
          className="servidores-ordenacao"
          onClick={() => alternarOrdenacao(campo)}
          aria-label={`Ordenar por ${rotulo}${ativo ? ordenacao.direcao === "asc" ? ", ordem crescente" : ", ordem decrescente" : ""}`}
        >
          {rotulo}
          <span aria-hidden="true">{ativo ? ordenacao.direcao === "asc" ? "↑" : "↓" : "↕"}</span>
        </button>
      </th>
    );
  }

  function alternarCampo(campo: string) {
    setCamposVisiveis(atual => atual.includes(campo)
      ? atual.filter(item => item !== campo)
      : [...atual, campo]);
  }

  function adicionarFiltro() {
    const campoDisponivel = camposFiltroServidor.find(campo =>
      !filtrosRascunho.some(filtro =>
        filtro.escopo === campo.escopo && filtro.campo === campo.chave,
      ),
    ) ?? camposFiltroServidor[0];
    setFiltrosRascunho(atual => [
      ...atual,
      {
        id: proximoFiltroId,
        escopo: campoDisponivel.escopo,
        campo: campoDisponivel.chave,
        valor: "",
      },
    ]);
    setProximoFiltroId(atual => atual + 1);
  }

  async function aplicarFiltros(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const filtrosValidos = filtrosRascunho.filter(filtro => filtro.valor.trim() !== "");
    setFiltrosAplicados(filtrosValidos);
    await carregarServidores(undefined, filtrosValidos);
  }

  async function limparFiltros() {
    setFiltrosRascunho([]);
    setFiltrosAplicados([]);
    setBusca("");
    setFiltroStatus("Todos");
    await carregarServidores(undefined, []);
  }

  async function excluir(servidor: Servidor) {
    if (!window.confirm(`Deseja excluir o cadastro de ${servidor.nome}? Esta ação não poderá ser desfeita.`)) return;

    try {
      setExcluindo(servidor.id);
      setErro("");
      setSucesso("");
      await excluirServidor(servidor.id);
      setServidores(atual => atual.filter(item => item.id !== servidor.id));
      setSucesso(`O cadastro de ${servidor.nome} foi excluído.`);
    } catch (error) {
      console.error(error);
      setErro(error instanceof Error ? error.message : "Não foi possível excluir o servidor.");
    } finally {
      setExcluindo(null);
    }
  }

  return (
    <div className="page servidores-page">
      <div className="page-head servidores-page-head">
        <div>
          <span className="servidores-eyebrow">GESTÃO DE PESSOAS</span>
          <h1>Servidores</h1>
          <p>Consulte e gerencie os servidores cadastrados no RH Digital.</p>
        </div>
        <button className="btn primary" type="button" onClick={onNew}>
          <Icon name="add" /> Novo servidor
        </button>
      </div>

      <div className="servidores-resumo" aria-label="Resumo de servidores">
        <div className="servidores-resumo-card">
          <span className="servidores-resumo-icon"><Icon name="users" /></span>
          <div><strong>{servidores.length}</strong><span>Total de servidores</span></div>
        </div>
        <div className="servidores-resumo-card">
          <span className="servidores-resumo-icon ativo"><Icon name="user-check" /></span>
          <div><strong>{ativos}</strong><span>Servidores ativos</span></div>
        </div>
        <div className="servidores-resumo-card">
          <span className="servidores-resumo-icon inativo"><Icon name="user-time" /></span>
          <div><strong>{servidores.length - ativos}</strong><span>Outras situações</span></div>
        </div>
      </div>

      {sucesso && <p className="form-success" role="status">{sucesso}</p>}
      {erro && (
        <div className="form-error servidores-alert" role="alert">
          <span>{erro}</span>
          {!loading && servidores.length === 0 && (
            <button className="btn outline" type="button" onClick={() => void carregarServidores()}>
              <Icon name="refresh" /> Tentar novamente
            </button>
          )}
        </div>
      )}

      <div className="card servidores-lista">
        <div className="servidores-lista-head">
          <div>
            <h2>Lista de servidores</h2>
            <p>{filtrados.length} {filtrados.length === 1 ? "cadastro encontrado" : "cadastros encontrados"}</p>
            {loading && <span className="muted">Atualizando resultados...</span>}
          </div>
          <div className="servidores-filtros">
            <label className="filter-search">
              <Icon name="search" />
              <input
                aria-label="Buscar servidor"
                value={busca}
                onChange={event => setBusca(event.target.value)}
                placeholder="Buscar por nome, CPF ou matrícula"
              />
            </label>
            <select aria-label="Filtrar por situação" value={filtroStatus} onChange={event => setFiltroStatus(event.target.value)}>
              <option>Todos</option>
              <option>Ativos</option>
              <option>Inativos</option>
            </select>
          </div>
        </div>

        <details className="servidores-configuracao">
          <summary><Icon name="settings-sliders" /> Configurar campos e filtros</summary>
          <div className="servidores-configuracao-conteudo">
            <section className="servidores-campos">
              <div>
                <h3>Campos exibidos</h3>
                <p>Escolha os campos adicionais que deseja ver na tabela.</p>
              </div>
              <div className="servidores-campos-grupos">
                {gruposCamposExibicao.map(grupo => (
                  <section className="servidores-campos-grupo" key={grupo.titulo}>
                    <h4>{grupo.titulo}</h4>
                    <div className="servidores-campos-lista">
                      {grupo.campos.map(campo => (
                        <label key={campo.chave}>
                          <input
                            type="checkbox"
                            checked={camposVisiveis.includes(campo.chave)}
                            onChange={() => alternarCampo(campo.chave)}
                          />
                          <span>{campo.rotulo}</span>
                        </label>
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            </section>

            <form className="servidores-filtros-form" onSubmit={aplicarFiltros}>
              <div className="servidores-filtros-titulo">
                <div>
                  <h3>Filtros da pesquisa</h3>
                  <p>Os critérios escolhidos são combinados com correspondência exata nos campos disponíveis.</p>
                </div>
                <button className="btn outline" type="button" onClick={adicionarFiltro}>
                  <Icon name="add" /> Adicionar filtro
                </button>
              </div>
              {filtrosRascunho.length === 0 ? (
                <p className="servidores-sem-filtros">Nenhum filtro adicional selecionado.</p>
              ) : filtrosRascunho.map(filtro => {
                const campo = camposFiltroServidor.find(item =>
                  item.escopo === filtro.escopo && item.chave === filtro.campo,
                ) ?? camposFiltroServidor[0];
                const opcoesCampo = opcoesPorCampo[campo.chave] ?? [];
                return (
                  <div className="servidor-filtro-linha" key={filtro.id}>
                    <label>
                      <span>Campo</span>
                      <select
                        value={`${filtro.escopo}.${filtro.campo}`}
                        onChange={event => {
                          const selecionado = camposFiltroServidor.find(opcao =>
                            `${opcao.escopo}.${opcao.chave}` === event.target.value,
                          );
                          if (!selecionado) return;
                          setFiltrosRascunho(atual => atual.map(item =>
                            item.id === filtro.id
                              ? {
                                ...item,
                                escopo: selecionado.escopo,
                                campo: selecionado.chave,
                                valor: "",
                              }
                              : item,
                          ));
                        }}
                      >
                        <optgroup label="Servidor">
                          {camposFiltroServidor.filter(opcao => opcao.escopo === "servidor").map(opcao => (
                            <option key={opcao.chave} value={`${opcao.escopo}.${opcao.chave}`}>{opcao.rotulo}</option>
                          ))}
                        </optgroup>
                        <optgroup label="Matrículas">
                          {camposFiltroServidor.filter(opcao => opcao.escopo === "matriculas").map(opcao => (
                            <option key={opcao.chave} value={`${opcao.escopo}.${opcao.chave}`}>{opcao.rotulo}</option>
                          ))}
                        </optgroup>
                        <optgroup label="Históricos funcionais">
                          {camposFiltroServidor.filter(opcao => opcao.escopo === "historicos_funcionais").map(opcao => (
                            <option key={opcao.chave} value={`${opcao.escopo}.${opcao.chave}`}>{opcao.rotulo}</option>
                          ))}
                        </optgroup>
                      </select>
                    </label>
                    <label>
                      <span>Valor</span>
                      {campo.tipo === "select" ? (
                        <select
                          required
                          value={filtro.valor}
                          onChange={event => setFiltrosRascunho(atual => atual.map(item =>
                            item.id === filtro.id ? { ...item, valor: event.target.value } : item,
                          ))}
                        >
                          <option value="">Selecione uma opção</option>
                          {opcoesCampo.map(opcao => (
                            <option key={opcao.valor} value={opcao.valor}>{opcao.descricao}</option>
                          ))}
                        </select>
                      ) : campo.tipo === "boolean" ? (
                        <select
                          required
                          value={filtro.valor}
                          onChange={event => setFiltrosRascunho(atual => atual.map(item =>
                            item.id === filtro.id ? { ...item, valor: event.target.value } : item,
                          ))}
                        >
                          <option value="">Selecione</option>
                          <option value="true">Sim</option>
                          <option value="false">Não</option>
                        </select>
                      ) : campo.tipo === "date" ? (
                        <input
                          required
                          type={campo.tipo}
                          value={filtro.valor}
                          onChange={event => setFiltrosRascunho(atual => atual.map(item =>
                            item.id === filtro.id ? { ...item, valor: event.target.value } : item,
                          ))}
                        />
                      ) : (
                        <input
                          required
                          type="text"
                          value={filtro.valor}
                          onChange={event => setFiltrosRascunho(atual => atual.map(item =>
                            item.id === filtro.id ? { ...item, valor: event.target.value } : item,
                          ))}
                        />
                      )}
                    </label>
                    <button
                      className="servidor-remover-filtro"
                      type="button"
                      aria-label={`Remover filtro ${campo.rotulo}`}
                      title="Remover filtro"
                      onClick={() => setFiltrosRascunho(atual => atual.filter(item => item.id !== filtro.id))}
                    >
                      <Icon name="cross" />
                    </button>
                  </div>
                );
              })}
              <div className="servidores-filtros-acoes">
                <button className="btn outline" type="button" onClick={() => {
                  void limparFiltros();
                }}>
                  Limpar filtros
                </button>
                <button className="btn primary" type="submit">Aplicar filtros</button>
              </div>
            </form>
          </div>
        </details>

        <div className="table-scroll">
          <table className="table servidores-table">
            <thead>
              <tr>
                {cabecalhoOrdenavel("Servidor", "nome")}
                {cabecalhoOrdenavel("Matrícula", "matricula")}
                {cabecalhoOrdenavel("Situação", "situacao")}
                {colunasAdicionais.map(campo => cabecalhoOrdenavel(campo.rotulo, campo.chave))}
                <th className="servidores-acoes-heading">Ações</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={4 + colunasAdicionais.length} className="table-message">Carregando servidores...</td></tr>
              ) : filtrados.length === 0 ? (
                <tr>
                  <td colSpan={4 + colunasAdicionais.length} className="servidores-empty">
                    <span className="servidores-empty-icon"><Icon name="users" /></span>
                    <strong>{servidores.length ? "Nenhum resultado encontrado" : "Nenhum servidor cadastrado"}</strong>
                    <span>{servidores.length ? "Tente ajustar os termos ou filtros da busca." : "Cadastre um servidor para começar a montar sua lista."}</span>
                    {!servidores.length && <button className="btn primary" type="button" onClick={onNew}><Icon name="add" /> Cadastrar servidor</button>}
                  </td>
                </tr>
              ) : ordenados.map(servidor => {
                const matriculas = listaMatriculas(servidor);
                const destaque = escolherMatricula(servidor, filtrosAplicados);
                const matriculasOrdenadas = destaque.matricula
                  ? [destaque.matricula, ...matriculas.filter(matricula => matricula !== destaque.matricula)]
                  : matriculas;
                const expandido = servidorExpandido === servidor.id;
                return (
                  <Fragment key={servidor.id}>
                    <tr>
                      <td>
                        <div className="servidor-identidade">
                          <span className="servidor-avatar">{iniciais(servidor.nome)}</span>
                          <div><strong>{servidor.nome}</strong><span>ID {servidor.id}</span></div>
                        </div>
                      </td>
                      <td>
                        <div className="servidor-matricula-principal">
                          <span>{String(destaque.matricula?.numero ?? servidor.matricula ?? "—")}</span>
                          {matriculas.length > 0 && (
                            <button
                              type="button"
                              className="servidores-matriculas-toggle"
                              onClick={() => setServidorExpandido(atual => atual === servidor.id ? null : servidor.id)}
                              aria-expanded={expandido}
                              aria-label={`${expandido ? "Ocultar" : "Exibir"} ${matriculas.length} matrículas de ${servidor.nome}`}
                              title={`${expandido ? "Ocultar" : "Exibir"} matrículas`}
                            >
                              <span>{matriculas.length} {matriculas.length === 1 ? "matrícula" : "matrículas"}</span>
                              <Icon name={expandido ? "angle-small-up" : "angle-small-down"} />
                            </button>
                          )}
                        </div>
                      </td>
                      <td><Status tone={servidor.status === "Ativo" ? "green" : "yellow"}>{servidor.status}</Status></td>
                      {colunasAdicionais.map(campo => (
                        <td
                          className={[
                            campo.chave === "cpf" ? "servidor-cpf" : "",
                            camposRelacionados.some(relacionado => relacionado.chave === campo.chave)
                              ? "servidores-campo-relacionado"
                              : "",
                          ].filter(Boolean).join(" ") || undefined}
                          key={campo.chave}
                        >
                          {mostrarCampo(campo, obterValorExibicao(servidor, campo, filtrosAplicados), opcoesPorCampo[campo.chave] ?? [])}
                        </td>
                      ))}
                      <td>
                        <div className="action-buttons servidores-action-buttons">
                          <button type="button" className="servidores-action" onClick={() => onProfile(servidor)} aria-label={`Ver perfil de ${servidor.nome}`} title="Ver perfil">
                            <Icon name="eye" /><span>Ver</span>
                          </button>
                          <button type="button" className="servidores-action" onClick={() => onEdit(servidor)} aria-label={`Editar ${servidor.nome}`} title="Editar">
                            <Icon name="edit" /><span>Editar</span>
                          </button>
                          <button
                            type="button"
                            className="servidores-action danger"
                            onClick={() => void excluir(servidor)}
                            disabled={excluindo !== null}
                            aria-label={`Excluir ${servidor.nome}`}
                            title="Excluir"
                          >
                            <Icon name="trash" /><span>{excluindo === servidor.id ? "Excluindo..." : "Excluir"}</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                    {expandido && (
                      matriculasOrdenadas.length ? matriculasOrdenadas.map(matricula => {
                        const historicoSelecionado = escolherHistorico(matricula, filtrosAplicados);
                        const correspondeFiltroAplicado = filtrosAplicados.some(filtro =>
                          filtro.escopo === "matriculas" || filtro.escopo === "historicos_funcionais",
                        ) && matricula === destaque.matricula;
                        return (
                        <tr
                          className={`servidores-matricula-linha${correspondeFiltroAplicado ? " selecionada" : ""}`}
                          key={`${servidor.id}-${String(matricula.id_matricula ?? matricula.numero)}`}
                        >
                          <td><span className="servidores-matricula-indicador">{correspondeFiltroAplicado ? "Correspondente" : ""}</span></td>
                          <td>{String(matricula.numero ?? "—")}</td>
                          <td>{matricula.ativo === true ? "Ativa" : "Inativa"}</td>
                          {colunasAdicionais.map(campo => {
                            const relacionado = camposRelacionados.some(item => item.chave === campo.chave);
                            if (!relacionado) return <td key={campo.chave} />;

                            const valor = obterValorMatricula(matricula, campo, historicoSelecionado);
                            const exibicao = campo.chave === "inicio_historico_atual"
                              ? formatarDataRelacionada(valor)
                              : descricaoRelacionada(valor)
                                || mostrarCampo(campo, valor, opcoesPorCampo[campo.chave] ?? []);
                            return <td key={campo.chave}>{exibicao}</td>;
                          })}
                          <td />
                        </tr>
                      );
                      }) : (
                        <tr className="servidores-matricula-linha" key={`${servidor.id}-sem-matriculas`}>
                          <td colSpan={3 + colunasAdicionais.length} className="muted">Nenhuma matrícula cadastrada.</td>
                          <td />
                        </tr>
                      )
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Servidores;
