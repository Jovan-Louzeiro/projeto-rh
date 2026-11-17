import { useEffect, useState } from "react";
import type { Quinquenio } from "../types";
import { calcularSituacaoQuinquenio, listarQuinquenios } from "../services/quinquenios";
import Icon from "./Icon";
import Status from "./Status";

type Props = {
  servidorId: string;
  onNew: () => void;
  onEdit: (id: string) => void;
};

export default function QuinqueniosServidor({ servidorId, onNew, onEdit }: Props) {
  const [items, setItems] = useState<Quinquenio[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setErro("");
    listarQuinquenios(controller.signal)
      .then(registros => {
        if (!controller.signal.aborted) {
          setItems(registros
            .filter(item => item.servidorId === servidorId)
            .map(item => ({ ...item, situacao: calcularSituacaoQuinquenio(item) })));
        }
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted) {
          setErro(error instanceof Error ? error.message : "Não foi possível carregar os quinquênios do servidor.");
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [servidorId]);

  return (
    <section className="perfil-requerimentos">
      <div className="perfil-requerimentos-heading">
        <div>
          <span className="requerimento-eyebrow">ACOMPANHAMENTO INDIVIDUAL</span>
          <h2>Quinquênios do servidor</h2>
          <p>Consulte os adicionais por tempo de serviço ou cadastre um novo registro para este servidor.</p>
        </div>
        <button className="btn primary" type="button" onClick={onNew}>
          <Icon name="add" /> Novo quinquênio
        </button>
      </div>

      {erro && <p className="form-error" role="alert">{erro}</p>}

      <div className="perfil-requerimento-lista">
        <div className="perfil-requerimento-lista-heading">
          <div>
            <h3>Histórico de quinquênios</h3>
            <p>{loading ? "Carregando registros..." : `${items.length} registro(s)`}</p>
          </div>
          <Icon name="calendar-days" />
        </div>
        <div className="table-scroll">
          <table className="table">
            <thead>
              <tr>
                <th>Quinquênio</th>
                <th>Período aquisitivo</th>
                <th>Data de aquisição</th>
                <th>Início do pagamento</th>
                <th>Percentual</th>
                <th>Situação</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <Mensagem>Carregando quinquênios...</Mensagem>
              ) : erro ? (
                <Mensagem>Não foi possível carregar os quinquênios.</Mensagem>
              ) : items.length === 0 ? (
                <Mensagem>Nenhum quinquênio registrado para este servidor.</Mensagem>
              ) : items.map(item => (
                <tr key={item.id}>
                  <td>{item.numero}º ({item.numero * 5} anos)</td>
                  <td>{periodo(item.periodoAquisitivoInicio, item.periodoAquisitivoFim)}</td>
                  <td>{data(item.dataAquisicao)}</td>
                  <td>{data(item.dataInicioPagamento)}</td>
                  <td>{item.percentualAdicional}%</td>
                  <td><Status tone={tom(item.situacao)}>{item.situacao}</Status></td>
                  <td className="action-buttons">
                    {item.situacao !== "Cancelado" && (
                      <button
                        className="icon-btn"
                        type="button"
                        title="Editar"
                        aria-label={`Editar ${item.numero}º quinquênio`}
                        onClick={() => onEdit(item.id)}
                      >
                        <Icon name="edit" />
                      </button>
                    )}
                  </td>
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
  return <tr><td colSpan={7} className="table-message">{children}</td></tr>;
}

function periodo(inicio: string, fim: string) {
  return `${data(inicio)} a ${data(fim)}`;
}

function data(value: string) {
  return value ? value.split("-").reverse().join("/") : "—";
}

function tom(situacao: Quinquenio["situacao"]) {
  if (situacao === "Concedido" || situacao === "Implantado") return "green";
  if (situacao === "Suspenso" || situacao === "Cancelado") return "red";
  return "yellow";
}
