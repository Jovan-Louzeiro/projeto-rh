import { useEffect, useMemo, useState } from "react";
import type { Quinquenio, SituacaoQuinquenio } from "../types";
import { listarQuinquenios } from "../services/quinquenios";
import { listarServidores } from "../services/servidores";
import Icon from "../components/Icon";
import Status from "../components/Status";
import DemoNotice from "../components/DemoNotice";
import { carregarListaComDemo, gerarQuinqueniosDemo, servidores as servidoresDemo } from "../data/mock";
type Props = { onNew: () => void };
const situacoes: SituacaoQuinquenio[] = ["Em análise", "Aguardando concessão", "Concedido", "Implantado", "Suspenso", "Cancelado"];
export default function Quinquenios({ onNew }: Props) {
  const [items, setItems] = useState<Quinquenio[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [avisoDemo, setAvisoDemo] = useState("");

  useEffect(() => {
    const c = new AbortController();
    async function carregarDados() {
      try {
        const listaServidores = await carregarListaComDemo(
          () => listarServidores(c.signal),
          servidoresDemo,
          c.signal,
        );
        const resultado = await carregarListaComDemo(
          () => listarQuinquenios(c.signal),
          gerarQuinqueniosDemo(listaServidores.dados),
          c.signal,
        );
        if (c.signal.aborted) return;
        setItems(resultado.dados);
        setAvisoDemo(resultado.demonstracao
          ? `Exibindo quinquênios simulados vinculados a ${listaServidores.demonstracao ? "servidores de demonstração" : "servidores cadastrados"}; eles não foram salvos na API.`
          : listaServidores.aviso);
      } catch {
        if (!c.signal.aborted) setErro("Não foi possível carregar os dados.");
      } finally {
        if (!c.signal.aborted) setLoading(false);
      }
    }
    void carregarDados();
    return () => c.abort();
  }, []);

  const filtrados = useMemo(
    () => items.filter(item => `${item.servidor} ${item.matricula} ${item.numero} ${item.situacao}`.toLowerCase().includes(query.toLowerCase())),
    [items, query],
  );

  return <>
    <div className="page-head">
      <div><h1>Quinquênios</h1><p>Controle dos adicionais por tempo de serviço.</p></div>
      <button className="btn primary" onClick={onNew}><Icon name="add" /> Novo Registro</button>
    </div>
    <DemoNotice message={avisoDemo} />
    <div className="card table-card">
      <div className="filters">
        <div className="filter-search">
          <Icon name="search" />
          <input value={query} onChange={event => setQuery(event.target.value)} placeholder="Buscar..." />
        </div>
        <select><option>Todos</option>{situacoes.map(situacao => <option key={situacao}>{situacao}</option>)}</select>
        <button className="btn outline"><Icon name="filter" /> Filtros</button>
      </div>
      <div className="table-scroll">
        <table className="table">
          <thead><tr><th>Servidor</th><th>Quinquênio</th><th>Data de aquisição</th><th>Percentual</th><th>Situação</th></tr></thead>
          <tbody>
            {loading ? <Mensagem>Carregando dados...</Mensagem>
              : erro ? <Mensagem>{erro}</Mensagem>
                : filtrados.length === 0 ? <Mensagem>Nenhum quinquênio encontrado.</Mensagem>
                  : filtrados.map(item => (
                    <tr key={item.id}>
                      <td>{item.servidor}</td>
                      <td>{item.numero}º ({item.numero * 5} anos)</td>
                      <td>{data(item.dataAquisicao)}</td>
                      <td>{item.percentualAdicional}%</td>
                      <td><Status tone={tom(item.situacao)}>{item.situacao}</Status></td>
                    </tr>
                  ))}
          </tbody>
        </table>
      </div>
    </div>
  </>;
}
function Mensagem({ children }: { children: string }) { return <tr><td colSpan={5} className="table-message">{children}</td></tr>; } function data(value: string) { return value ? value.split("-").reverse().join("/") : "—"; } function tom(s: SituacaoQuinquenio) { return s === "Concedido" || s === "Implantado" ? "green" : s === "Suspenso" || s === "Cancelado" ? "red" : s === "Aguardando concessão" ? "yellow" : "blue"; }
