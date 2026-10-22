import { useEffect, useMemo, useState } from "react";
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

type FiltroServidor = {
  id: number;
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

const camposVisiveisIniciais = ["cpf", "data_nascimento"];
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
  if (campo.tipo === "date") return String(valor).slice(0, 10);
  return String(valor);
};

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
  const [sucesso, setSucesso] = useState("");

  async function carregarServidores(signal?: AbortSignal) {
    try {
      setLoading(true);
      setErro("");
      const [lista, opcoes, dadosGeograficos] = await Promise.all([
        listarServidores(signal),
        carregarOpcoesServidor(signal),
        carregarDadosGeograficos(signal),
      ]);
      setServidores(lista);
      setOpcoesServidor(opcoes);
      setGeografia(dadosGeograficos);
    } catch (error) {
      if (signal?.aborted) return;
      console.error(error);
      setErro(error instanceof Error ? error.message : "Não foi possível carregar os servidores.");
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }

  useEffect(() => {
    const controller = new AbortController();
    void carregarServidores(controller.signal);
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
      const ativo = servidor.status === "Ativo";
      const correspondeStatus = filtroStatus === "Todos"
        || (filtroStatus === "Ativos" && ativo)
        || (filtroStatus === "Inativos" && !ativo);
      const correspondeFiltros = filtrosAplicados.every(filtro =>
        normalizarValorFiltro(filtro.campo, servidor[filtro.campo])
          === normalizarValorFiltro(filtro.campo, filtro.valor),
      );
      return correspondeBusca && correspondeStatus && correspondeFiltros;
    });
  }, [servidores, busca, filtroStatus, filtrosAplicados]);

  const ativos = servidores.filter(servidor => servidor.status === "Ativo").length;
  const camposDeExibicao = camposServidor.filter(campo => campo.chave !== "nome_completo");
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
    escolaridade_id: opcoesServidor.escolaridades.map(opcao => ({ valor: String(opcao.id), descricao: opcao.descricao })),
    tipo_ensino_medio_cursado_id: opcoesServidor.tiposEnsinoMedio.map(opcao => ({ valor: String(opcao.id), descricao: opcao.descricao })),
  };
  const ordenados = [...filtrados].sort((a, b) => {
    const valorOrdenacao = (servidor: Servidor) => {
      if (ordenacao.campo === "situacao") return servidor.status;
      const valor = servidor[ordenacao.campo];
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
    const campoDisponivel = camposServidor.find(campo =>
      !filtrosRascunho.some(filtro => filtro.campo === campo.chave),
    ) ?? camposServidor[0];
    setFiltrosRascunho(atual => [
      ...atual,
      { id: proximoFiltroId, campo: campoDisponivel.chave, valor: "" },
    ]);
    setProximoFiltroId(atual => atual + 1);
  }

  function aplicarFiltros(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFiltrosAplicados(filtrosRascunho);
    setErro("");
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
                <p>Nome, matrícula, situação e ações são mantidos para identificar cada servidor.</p>
              </div>
              <div className="servidores-campos-lista">
                {camposDeExibicao.map(campo => (
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
                const campo = camposServidor.find(item => item.chave === filtro.campo) ?? camposServidor[0];
                const opcoesCampo = opcoesPorCampo[campo.chave] ?? [];
                return (
                  <div className="servidor-filtro-linha" key={filtro.id}>
                    <label>
                      <span>Campo</span>
                      <select
                        value={filtro.campo}
                        onChange={event => setFiltrosRascunho(atual => atual.map(item =>
                          item.id === filtro.id ? { ...item, campo: event.target.value, valor: "" } : item,
                        ))}
                      >
                        {camposServidor.map(opcao => (
                          <option key={opcao.chave} value={opcao.chave}>{opcao.rotulo}</option>
                        ))}
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
                  setFiltrosRascunho([]);
                  setFiltrosAplicados([]);
                  setBusca("");
                  setFiltroStatus("Todos");
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
              ) : ordenados.map(servidor => (
                <tr key={servidor.id}>
                  <td>
                    <div className="servidor-identidade">
                      <span className="servidor-avatar">{iniciais(servidor.nome)}</span>
                      <div><strong>{servidor.nome}</strong><span>ID {servidor.id}</span></div>
                    </div>
                  </td>
                  <td>{servidor.matricula || "—"}</td>
                  <td><Status tone={servidor.status === "Ativo" ? "green" : "yellow"}>{servidor.status}</Status></td>
                  {colunasAdicionais.map(campo => (
                    <td className={campo.chave === "cpf" ? "servidor-cpf" : undefined} key={campo.chave}>
                        {mostrarCampo(campo, servidor[campo.chave], opcoesPorCampo[campo.chave] ?? [])}
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Servidores;
