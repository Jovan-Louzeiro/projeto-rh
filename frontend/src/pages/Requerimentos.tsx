import { useEffect, useMemo, useState } from "react";
import type { Requerimento, SituacaoRequerimento, TipoRequerimento } from "../types";
import {
  alterarSituacaoRequerimento,
  excluirRequerimento,
  gerarDocumentoRequerimento,
  listarRequerimentos,
} from "../services/requerimentos";
import Icon from "../components/Icon";
import MetricCard from "../components/MetricCard";
import Modal from "../components/Modal";
import Status from "../components/Status";
import {
  SITUACOES_REQUERIMENTO,
  TIPOS_REQUERIMENTO,
  formatarData,
  tomRequerimento,
} from "./requerimentosConfig";

type Props = {
  onView: (id: string) => void;
  onEdit: (id: string) => void;
};

export default function Requerimentos({ onView, onEdit }: Props) {
  const [items, setItems] = useState<Requerimento[]>([]);
  const [busca, setBusca] = useState("");
  const [situacao, setSituacao] = useState("Todos");
  const [tipo, setTipo] = useState("Todos");
  const [inicio, setInicio] = useState("");
  const [fim, setFim] = useState("");
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [alterando, setAlterando] = useState<Requerimento | null>(null);
  const [novaSituacao, setNovaSituacao] = useState<SituacaoRequerimento | "">("");
  const [observacao, setObservacao] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    listarRequerimentos({}, controller.signal)
      .then(setItems)
      .catch(error => {
        if (!controller.signal.aborted) {
          setErro(error instanceof Error ? error.message : "Não foi possível carregar os requerimentos.");
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, []);

  const filtrados = useMemo(() => items.filter(item => {
    const texto = `${item.protocolo} ${item.servidor} ${item.matricula} ${item.tipos.join(" ")}`
      .toLocaleLowerCase();
    return (!busca || texto.includes(busca.toLocaleLowerCase()))
      && (situacao === "Todos" || item.situacao === situacao)
      && (tipo === "Todos" || item.tipos.includes(tipo as TipoRequerimento))
      && (!inicio || item.dataEntrada >= inicio)
      && (!fim || item.dataEntrada <= fim);
  }), [items, busca, situacao, tipo, inicio, fim]);

  async function mudarSituacao() {
    if (!alterando || !novaSituacao) {
      setErro("Selecione a nova situação.");
      return;
    }

    setErro("");
    try {
      const salvo = await alterarSituacaoRequerimento(alterando.id, novaSituacao, observacao.trim());
      setItems(atual => atual.map(item => item.id === salvo.id ? salvo : item));
      setAlterando(null);
      setSucesso("Situação atualizada e registrada no histórico.");
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Não foi possível alterar a situação.");
    }
  }

  async function excluir(item: Requerimento) {
    if (!window.confirm(`Excluir o requerimento ${item.protocolo}? Esta ação deve ser autorizada pela API.`)) return;

    setErro("");
    try {
      await excluirRequerimento(item.id);
      setItems(atual => atual.filter(registro => registro.id !== item.id));
      setSucesso("Requerimento excluído com sucesso.");
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Não foi possível excluir o requerimento.");
    }
  }

  async function baixarDocumento(item: Requerimento) {
    try {
      const blob = await gerarDocumentoRequerimento(item.id);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `requerimento-${item.protocolo}.docx`;
      link.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 60000);
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Não foi possível gerar o documento.");
    }
  }

  const total = (status?: SituacaoRequerimento) =>
    String(status ? items.filter(item => item.situacao === status).length : items.length);

  function limparFiltros() {
    setBusca("");
    setSituacao("Todos");
    setTipo("Todos");
    setInicio("");
    setFim("");
  }

  return (
    <>
      <div className="page-head requerimentos-page-head">
        <div>
          <span className="requerimento-eyebrow">GESTÃO FUNCIONAL</span>
          <h1>Requerimentos</h1>
          <p>Acompanhe, analise e atualize as solicitações dos servidores.</p>
        </div>
        <div className="requerimentos-head-note">
          <Icon name="document-signed" />
          <span>Cadastro realizado pelo perfil de cada servidor</span>
        </div>
      </div>

      <div className="cards requerimentos-metrics">
        <MetricCard icon="document" value={total()} label="Total de requerimentos" />
        <MetricCard icon="time-past" value={total("Pendente")} label="Pendentes" />
        <MetricCard icon="search-alt" value={total("Em análise")} label="Em análise" />
        <MetricCard icon="check" value={total("Deferido")} label="Deferidos" />
        <MetricCard icon="cross-circle" value={total("Indeferido")} label="Indeferidos" />
      </div>

      {sucesso && <p className="form-success">{sucesso}</p>}
      {erro && <p className="form-error" role="alert">{erro}</p>}

      <div className="card table-card">
        <div className="requerimentos-lista-heading">
          <div>
            <h2>Controle de requerimentos</h2>
            <p>{loading ? "Carregando registros..." : `${filtrados.length} de ${items.length} registro(s)`}</p>
          </div>
          <span className="requerimentos-controle-tag"><Icon name="settings" /> Painel de controle</span>
        </div>
        <div className="filters requerimentos-filtros">
          <div className="filter-search">
            <Icon name="search" />
            <input
              value={busca}
              onChange={event => setBusca(event.target.value)}
              placeholder="Buscar por servidor, matrícula ou protocolo..."
            />
          </div>
          <select aria-label="Filtrar por situação" value={situacao} onChange={event => setSituacao(event.target.value)}>
            <option>Todos</option>
            {SITUACOES_REQUERIMENTO.map(status => <option key={status}>{status}</option>)}
          </select>
          <select aria-label="Filtrar por tipo" value={tipo} onChange={event => setTipo(event.target.value)}>
            <option>Todos</option>
            {TIPOS_REQUERIMENTO.map(tipoRequerimento => <option key={tipoRequerimento}>{tipoRequerimento}</option>)}
          </select>
          <label className="requerimentos-data-filtro">
            <span>Data inicial</span>
            <input type="date" value={inicio} onChange={event => setInicio(event.target.value)} />
          </label>
          <label className="requerimentos-data-filtro">
            <span>Data final</span>
            <input type="date" value={fim} onChange={event => setFim(event.target.value)} />
          </label>
          <button className="btn outline" onClick={limparFiltros}><Icon name="filter-slash" /> Limpar filtros</button>
        </div>

        <div className="table-scroll">
          <table className="table">
            <thead>
              <tr>
                <th>Nº do Protocolo</th>
                <th>Servidor</th>
                <th>Matrícula</th>
                <th>Tipo</th>
                <th>Data de Entrada</th>
                <th>Situação</th>
                <th>Responsável</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <Mensagem>Carregando requerimentos...</Mensagem>
              ) : filtrados.length === 0 ? (
                <Mensagem>Nenhum requerimento encontrado.</Mensagem>
              ) : filtrados.map(item => (
                <tr key={item.id}>
                  <td>{item.protocolo}</td>
                  <td>{item.servidor}</td>
                  <td>{item.matricula}</td>
                  <td>{item.tipos.join(", ")}</td>
                  <td>{formatarData(item.dataEntrada)}</td>
                  <td><Status tone={tomRequerimento(item.situacao)}>{item.situacao}</Status></td>
                  <td>{item.responsavel || "—"}</td>
                  <td className="action-buttons">
                    <button className="icon-btn" title="Visualizar" onClick={() => onView(item.id)}><Icon name="eye" /></button>
                    <button className="icon-btn" title="Editar" onClick={() => onEdit(item.id)}><Icon name="edit" /></button>
                    <button
                      className="icon-btn"
                      title="Alterar situação"
                      onClick={() => {
                        setAlterando(item);
                        setNovaSituacao("");
                        setObservacao("");
                      }}
                    >
                      <Icon name="refresh" />
                    </button>
                    <button className="icon-btn" title="Baixar DOCX" onClick={() => baixarDocumento(item)}><Icon name="document" /></button>
                    <button className="icon-btn danger" title="Excluir" onClick={() => void excluir(item)}><Icon name="trash" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {alterando && (
        <Modal title="Alterar situação do requerimento" onClose={() => setAlterando(null)}>
          <p className="muted">{alterando.protocolo} — {alterando.servidor}</p>
          <label>
            Nova situação
            <select value={novaSituacao} onChange={event => setNovaSituacao(event.target.value as SituacaoRequerimento)}>
              <option value="">Selecione</option>
              {SITUACOES_REQUERIMENTO.map(status => <option key={status}>{status}</option>)}
            </select>
          </label>
          <label>
            Observação
            <textarea
              value={observacao}
              onChange={event => setObservacao(event.target.value)}
              placeholder="Informe o motivo ou observação da alteração"
            />
          </label>
          <div className="form-actions">
            <button className="btn outline" onClick={() => setAlterando(null)}>Cancelar</button>
            <button className="btn primary" onClick={() => void mudarSituacao()}>Confirmar alteração</button>
          </div>
        </Modal>
      )}
    </>
  );
}

function Mensagem({ children }: { children: string }) {
  return <tr><td colSpan={8} className="table-message">{children}</td></tr>;
}
