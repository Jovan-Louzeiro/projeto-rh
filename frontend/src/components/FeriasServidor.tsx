import { useEffect, useState } from "react";
import type { Ferias } from "../types";
import { listarFeriasServidor } from "../services/ferias";
import Icon from "./Icon";
import Status from "./Status";

type Props = {
  servidorId: string;
  onNew: () => void;
};

export default function FeriasServidor({ servidorId, onNew }: Props) {
  const [items, setItems] = useState<Ferias[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setErro("");
    listarFeriasServidor(servidorId, controller.signal)
      .then(setItems)
      .catch((error: unknown) => {
        if (!controller.signal.aborted) {
          setErro(error instanceof Error ? error.message : "Não foi possível carregar as férias do servidor.");
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [servidorId]);

  const aprovadas = items.filter((item) => item.situacao === "Aprovada").length;
  const emAndamento = items.filter((item) => item.situacao === "Em andamento").length;
  const encerradas = items.filter((item) => item.situacao === "Encerrada").length;
  const canceladas = items.filter((item) => item.situacao === "Cancelada").length;

  return (
    <section className="perfil-requerimentos">
      <div className="perfil-requerimentos-heading">
        <div>
          <span className="requerimento-eyebrow">ACOMPANHAMENTO INDIVIDUAL</span>
          <h2>Férias do servidor</h2>
          <p>Consulte os períodos registrados ou cadastre férias vinculadas a este servidor.</p>
        </div>
        <button className="btn primary" type="button" onClick={onNew}>
          <Icon name="add" /> Novo período
        </button>
      </div>

      <div className="perfil-requerimento-stats" aria-label="Resumo das férias">
        <div><span>Aprovadas</span><strong>{aprovadas}</strong></div>
        <div><span>Em andamento</span><strong>{emAndamento}</strong></div>
        <div><span>Encerradas</span><strong>{encerradas}</strong></div>
        <div><span>Canceladas</span><strong>{canceladas}</strong></div>
      </div>

      {erro && <p className="form-error" role="alert">{erro}</p>}

      <div className="perfil-requerimento-lista">
        <div className="perfil-requerimento-lista-heading">
          <div>
            <h3>Histórico de férias</h3>
            <p>{loading ? "Carregando registros..." : `${items.length} período(s)`}</p>
          </div>
          <Icon name="calendar-days" />
        </div>
        <div className="table-scroll">
          <table className="table">
            <thead>
              <tr>
                <th>Período aquisitivo</th>
                <th>Período de férias</th>
                <th>Dias</th>
                <th>Situação</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <Mensagem>Carregando férias...</Mensagem>
              ) : items.length === 0 ? (
                <Mensagem>Nenhum período de férias registrado para este servidor.</Mensagem>
              ) : items.map((item) => (
                <tr key={item.id}>
                  <td>{periodo(item.periodoAquisitivoInicio, item.periodoAquisitivoFim)}</td>
                  <td>{periodo(item.inicio, item.fim)}</td>
                  <td>{item.dias}</td>
                  <td><Status tone={tom(item.situacao)}>{item.situacao}</Status></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function Mensagem({ children }: { children: string }) {
  return <tr><td colSpan={4} className="table-message">{children}</td></tr>;
}

function periodo(inicio: string, fim: string) {
  return `${formatarData(inicio)} a ${formatarData(fim)}`;
}

function formatarData(data: string) {
  return data ? data.split("-").reverse().join("/") : "—";
}

function tom(situacao: Ferias["situacao"]) {
  if (situacao === "Encerrada") return "green";
  if (situacao === "Cancelada") return "red";
  return "blue";
}
