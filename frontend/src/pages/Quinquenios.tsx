import { useEffect, useMemo, useState } from "react";
import type { Quinquenio, SituacaoQuinquenio } from "../types";
import {
  baixarDocumentoQuinquenio,
  calcularSituacaoQuinquenio,
  cancelarQuinquenio,
  listarQuinquenios,
} from "../services/quinquenios";
import Icon from "../components/Icon";
import Status from "../components/Status";
type Props = { onEdit: (id: string) => void };
const situacoes: SituacaoQuinquenio[] = ["Aguardando concessão", "Concedido", "Implantado", "Suspenso", "Cancelado"];
export default function Quinquenios({ onEdit }: Props) {
  const [items, setItems] = useState<Quinquenio[]>([]);
  const [query, setQuery] = useState("");
  const [filtro, setFiltro] = useState<"Todos" | SituacaoQuinquenio>("Todos");
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [acaoId, setAcaoId] = useState("");

  useEffect(() => {
    const c = new AbortController();
    listarQuinquenios(c.signal)
      .then((registros) => {
        if (c.signal.aborted) return;
        setItems(registros.map((item) => ({
          ...item,
          situacao: calcularSituacaoQuinquenio(item),
        })));
      })
      .catch((error: unknown) => {
        if (!c.signal.aborted) {
          console.error("[Quinquenios] Erro ao carregar registros:", error);
          setErro(error instanceof Error ? error.message : "Não foi possível carregar os quinquênios.");
        }
      })
      .finally(() => {
        if (!c.signal.aborted) setLoading(false);
      });
    return () => c.abort();
  }, []);

  async function cancelar(item: Quinquenio) {
    if (!window.confirm(`Cancelar o ${item.numero}º quinquênio de ${item.servidor}?`)) return;
    setAcaoId(item.id);
    setErro("");
    try {
      const atualizado = await cancelarQuinquenio(item.id);
      setItems((atuais) => atuais.map((registro) => registro.id === atualizado.id ? atualizado : registro));
    } catch (error) {
      console.error("[Quinquenios] Erro ao cancelar registro:", error);
      setErro(error instanceof Error ? error.message : "Não foi possível cancelar o quinquênio.");
    } finally {
      setAcaoId("");
    }
  }

  async function baixarDocumento(item: Quinquenio) {
    try {
      const blob = await baixarDocumentoQuinquenio(item.id);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = item.atoDocumento || "ato-quinquenio";
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("[Quinquenios] Erro ao baixar ato:", error);
      setErro(error instanceof Error ? error.message : "Não foi possível baixar o ato administrativo.");
    }
  }

  const filtrados = useMemo(
    () => items.filter(item =>
      (filtro === "Todos" || item.situacao === filtro) &&
      `${item.servidor} ${item.matricula} ${item.numero} ${item.situacao}`.toLowerCase().includes(query.toLowerCase())
    ),
    [items, query, filtro],
  );

  return <>
    <div className="page-head">
      <div><h1>Quinquênios</h1><p>Controle dos adicionais por tempo de serviço.</p></div>
    </div>
    <div className="card table-card">
      <div className="filters">
        <div className="filter-search">
          <Icon name="search" />
          <input value={query} onChange={event => setQuery(event.target.value)} placeholder="Buscar..." />
        </div>
        <select aria-label="Filtrar por situação" value={filtro} onChange={event => setFiltro(event.target.value as "Todos" | SituacaoQuinquenio)}><option value="Todos">Todas as situações</option>{situacoes.map(situacao => <option key={situacao} value={situacao}>{situacao}</option>)}</select>
      </div>
      {erro && <p className="form-error" role="alert">{erro}</p>}
      <div className="table-scroll">
        <table className="table">
          <thead><tr><th>Servidor</th><th>Quinquênio</th><th>Data de aquisição</th><th>Percentual</th><th>Situação</th><th>Ações</th></tr></thead>
          <tbody>
            {loading ? <Mensagem>Carregando dados...</Mensagem>
              : erro ? <Mensagem>Não foi possível carregar os quinquênios.</Mensagem>
                : filtrados.length === 0 ? <Mensagem>Nenhum quinquênio encontrado.</Mensagem>
                  : filtrados.map(item => (
                    <tr key={item.id}>
                      <td>{item.servidor}</td>
                      <td>{item.numero}º ({item.numero * 5} anos)</td>
                      <td>{data(item.dataAquisicao)}</td>
                      <td>{item.percentualAdicional}%</td>
                      <td><Status tone={tom(item.situacao)}>{item.situacao}</Status></td>
                      <td className="action-buttons">
                        {item.situacao !== "Cancelado" && (
                          <button className="icon-btn" type="button" title="Editar" aria-label="Editar" disabled={Boolean(acaoId)} onClick={() => onEdit(item.id)}>
                            <Icon name="edit" />
                          </button>
                        )}
                        {item.atoDocumento && (
                          <button className="icon-btn" type="button" title="Baixar ato administrativo" aria-label="Baixar ato administrativo" onClick={() => void baixarDocumento(item)}>
                            <Icon name="download" />
                          </button>
                        )}
                        {item.situacao !== "Cancelado" && (
                          <button className="icon-btn danger" type="button" title="Cancelar" aria-label="Cancelar" disabled={Boolean(acaoId)} onClick={() => void cancelar(item)}>
                            <Icon name="cross-circle" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
          </tbody>
        </table>
      </div>
    </div>
  </>;
}
function Mensagem({ children }: { children: string }) { return <tr><td colSpan={6} className="table-message">{children}</td></tr>; }
function data(value: string) { return value ? value.split("-").reverse().join("/") : "—"; }
function tom(s: SituacaoQuinquenio) {
  if (s === "Concedido" || s === "Implantado") return "green";
  if (s === "Suspenso" || s === "Cancelado") return "red";
  return "yellow";
}
