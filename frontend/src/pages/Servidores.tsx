import { useEffect, useMemo, useState } from "react";
import type { Servidor } from "../types";
import { excluirServidor, listarServidores } from "../services/servidores";
import Icon from "../components/Icon";
import Status from "../components/Status";

type Props = {
  onProfile: (servidor: Servidor) => void;
  onEdit: (servidor: Servidor) => void;
  onNew: () => void;
};

const formatarCpf = (cpf?: string) => {
  const numeros = (cpf ?? "").replace(/\D/g, "");
  return numeros.length === 11
    ? `${numeros.slice(0, 3)}.${numeros.slice(3, 6)}.${numeros.slice(6, 9)}-${numeros.slice(9)}`
    : cpf || "—";
};

const iniciais = (nome: string) =>
  nome.trim().split(/\s+/).slice(0, 2).map(parte => parte[0]).join("").toUpperCase();

export function Servidores({ onProfile, onEdit, onNew }: Props) {
  const [servidores, setServidores] = useState<Servidor[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("Todos");
  const [excluindo, setExcluindo] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState("");

  async function carregarServidores() {
    try {
      setLoading(true);
      setErro("");
      setServidores(await listarServidores());
    } catch (error) {
      console.error(error);
      setErro(error instanceof Error ? error.message : "Não foi possível carregar os servidores.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void carregarServidores();
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
      return correspondeBusca && correspondeStatus;
    });
  }, [servidores, busca, filtroStatus]);

  const ativos = servidores.filter(servidor => servidor.status === "Ativo").length;

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

        <div className="table-scroll">
          <table className="table servidores-table">
            <thead>
              <tr>
                <th>Servidor</th>
                <th>Matrícula</th>
                <th>CPF</th>
                <th>Situação</th>
                <th className="servidores-acoes-heading">Ações</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="table-message">Carregando servidores...</td></tr>
              ) : filtrados.length === 0 ? (
                <tr>
                  <td colSpan={5} className="servidores-empty">
                    <span className="servidores-empty-icon"><Icon name="users" /></span>
                    <strong>{servidores.length ? "Nenhum resultado encontrado" : "Nenhum servidor cadastrado"}</strong>
                    <span>{servidores.length ? "Tente ajustar os termos ou filtros da busca." : "Cadastre um servidor para começar a montar sua lista."}</span>
                    {!servidores.length && <button className="btn primary" type="button" onClick={onNew}><Icon name="add" /> Cadastrar servidor</button>}
                  </td>
                </tr>
              ) : filtrados.map(servidor => (
                <tr key={servidor.id}>
                  <td>
                    <div className="servidor-identidade">
                      <span className="servidor-avatar">{iniciais(servidor.nome)}</span>
                      <div><strong>{servidor.nome}</strong><span>ID {servidor.id}</span></div>
                    </div>
                  </td>
                  <td>{servidor.matricula || "—"}</td>
                  <td className="servidor-cpf">{formatarCpf(servidor.cpf)}</td>
                  <td><Status tone={servidor.status === "Ativo" ? "green" : "yellow"}>{servidor.status}</Status></td>
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
