import { useEffect, useState } from "react";
import type { LicencaAfastamento } from "../types";
import { listarLicencasServidor } from "../services/licencas";
import Icon from "./Icon";
import Status from "./Status";

type Props = {
  servidorId: string;
  onNew: () => void;
};

export default function LicencasServidor({ servidorId, onNew }: Props) {
  const [items, setItems] = useState<LicencaAfastamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setErro("");
    listarLicencasServidor(servidorId, controller.signal)
      .then(setItems)
      .catch((error: unknown) => {
        if (!controller.signal.aborted) {
          setErro(error instanceof Error ? error.message : "Não foi possível carregar as licenças do servidor.");
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
          <h2>Licenças e afastamentos</h2>
          <p>Consulte os registros aprovados ou cadastre um novo período para este servidor.</p>
        </div>
        <button className="btn primary" type="button" onClick={onNew}>
          <Icon name="add" /> Novo registro
        </button>
      </div>

      {erro && <p className="form-error" role="alert">{erro}</p>}

      <div className="perfil-requerimento-lista">
        <div className="perfil-requerimento-lista-heading">
          <div>
            <h3>Histórico de licenças e afastamentos</h3>
            <p>{loading ? "Carregando registros..." : `${items.length} registro(s)`}</p>
          </div>
          <Icon name="calendar-days" />
        </div>
        <div className="table-scroll">
          <table className="table">
            <thead>
              <tr>
                <th>Tipo</th>
                <th>Início</th>
                <th>Término</th>
                <th>Dias</th>
                <th>Situação</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <Mensagem>Carregando licenças...</Mensagem>
              ) : items.length === 0 ? (
                <Mensagem>Nenhuma licença ou afastamento registrado para este servidor.</Mensagem>
              ) : items.map((item) => (
                <tr key={item.id}>
                  <td>{item.tipo}</td>
                  <td>{data(item.inicio)}</td>
                  <td>{item.semDataTermino ? "Sem previsão" : data(item.termino)}</td>
                  <td>{item.dias ?? "—"}</td>
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
  return <tr><td colSpan={5} className="table-message">{children}</td></tr>;
}

function data(value: string | null) {
  return value ? value.split("-").reverse().join("/") : "—";
}

function tom(situacao: LicencaAfastamento["situacao"]) {
  if (situacao === "Encerrada") return "green";
  if (situacao === "Cancelada") return "red";
  return "blue";
}
