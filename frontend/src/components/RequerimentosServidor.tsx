import { useEffect, useState } from "react";
import type { Requerimento } from "../types";
import { listarRequerimentos } from "../services/requerimentos";
import Icon from "./Icon";
import Status from "./Status";
import { formatarData, tomRequerimento } from "../pages/requerimentosConfig";

type Props = {
  servidorId: string;
  onNew: () => void;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
};

export default function RequerimentosServidor({ servidorId, onNew, onView, onEdit }: Props) {
  const [items, setItems] = useState<Requerimento[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setErro("");
    listarRequerimentos({ servidorId }, controller.signal)
      .then(setItems)
      .catch(error => {
        if (!controller.signal.aborted) {
          setErro(error instanceof Error ? error.message : "Não foi possível carregar os requerimentos do servidor.");
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [servidorId]);

  const pendentes = items.filter(item => item.situacao === "Pendente").length;
  const emAnalise = items.filter(item => item.situacao === "Em análise").length;
  const encerrados = items.filter(item =>
    item.situacao === "Deferido"
    || item.situacao === "Indeferido"
    || item.situacao === "Finalizado"
    || item.situacao === "Cancelado",
  ).length;

  return (
    <section className="perfil-requerimentos">
      <div className="perfil-requerimentos-heading">
        <div>
          <span className="requerimento-eyebrow">ACOMPANHAMENTO INDIVIDUAL</span>
          <h2>Requerimentos do servidor</h2>
          <p>Consulte o histórico ou inicie uma nova solicitação já vinculada a este servidor.</p>
        </div>
        <button className="btn primary" type="button" onClick={onNew}>
          <Icon name="add" /> Novo requerimento
        </button>
      </div>

      <div className="perfil-requerimento-stats" aria-label="Resumo dos requerimentos">
        <div><span>Total</span><strong>{items.length}</strong></div>
        <div><span>Pendentes</span><strong>{pendentes}</strong></div>
        <div><span>Em análise</span><strong>{emAnalise}</strong></div>
        <div><span>Demais situações</span><strong>{encerrados}</strong></div>
      </div>

      {erro && <p className="form-error" role="alert">{erro}</p>}

      <div className="perfil-requerimento-lista">
        <div className="perfil-requerimento-lista-heading">
          <div>
            <h3>Histórico de solicitações</h3>
            <p>{loading ? "Carregando registros..." : `${items.length} requerimento(s)`}</p>
          </div>
          <Icon name="document-signed" />
        </div>
        <div className="table-scroll">
          <table className="table">
            <thead>
              <tr>
                <th>Protocolo</th>
                <th>Solicitação</th>
                <th>Data de entrada</th>
                <th>Situação</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <Mensagem>Carregando requerimentos...</Mensagem>
              ) : items.length === 0 ? (
                <Mensagem>Nenhum requerimento encontrado para este servidor.</Mensagem>
              ) : items.map(item => (
                <tr key={item.id}>
                  <td><strong className="perfil-requerimento-protocolo">{item.protocolo}</strong></td>
                  <td>{item.tipos.join(", ")}</td>
                  <td>{formatarData(item.dataEntrada)}</td>
                  <td><Status tone={tomRequerimento(item.situacao)}>{item.situacao}</Status></td>
                  <td className="action-buttons">
                    <button className="icon-btn" type="button" title="Visualizar" onClick={() => onView(item.id)}>
                      <Icon name="eye" />
                    </button>
                    <button className="icon-btn" type="button" title="Editar" onClick={() => onEdit(item.id)}>
                      <Icon name="edit" />
                    </button>
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
  return <tr><td colSpan={5} className="table-message">{children}</td></tr>;
}
