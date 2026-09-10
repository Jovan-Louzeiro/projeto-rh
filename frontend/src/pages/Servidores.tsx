import { useEffect, useMemo, useState } from "react";
import type { Servidor } from "../types";
import { listarServidores } from "../services/servidores";
import { listarSexos } from "../services/sexos";
import type { Sexo } from "../services/sexos";
import Icon from "../components/Icon";
import MetricCard from "../components/MetricCard";
import Status from "../components/Status";

type Props = {
  onProfile: (s: Servidor) => void;
  onNew: () => void;
};

export default function Servidores({ onProfile, onNew }: Props) {
  const [query, setQuery] = useState("");
  const [servidores, setServidores] = useState<Servidor[]>([]);
  const [sexosList, setSexosList] = useState<Sexo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Carregar servidores
  useEffect(() => {
    const controller = new AbortController();

    listarServidores(controller.signal)
      .then(setServidores)
      .catch((err: unknown) => {
        if (
          !(err instanceof DOMException && err.name === "AbortError")
        ) {
          setError(
            "Não foi possível carregar os servidores. Verifique a conexão com a API."
          );
        }
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, []);

  // Carregar sexos
  useEffect(() => {
    const controller = new AbortController();

    listarSexos(controller.signal)
      .then((data) => {
        setSexosList(data);
      })
      .catch((error: unknown) => {
        if (!(error instanceof DOMException && error.name === "AbortError")) {
          console.error("Erro ao buscar sexos:", error);
        }
      });

    return () => controller.abort();
  }, []);

  const filtered = useMemo(
    () =>
      servidores.filter((s) =>
        `${s.nome} ${s.matricula} ${s.cargo} ${s.secretaria}`
          .toLowerCase()
          .includes(query.toLowerCase())
      ),
    [query, servidores]
  );

  const quantidade = (status: Servidor["status"]) =>
    servidores.filter((s) => s.status === status).length;

  console.log("Sexos carregados:", sexosList);

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Servidores</h1>
          <p>Gerencie os servidores cadastrados no município.</p>
        </div>

        <button className="btn primary" onClick={onNew}>
          <Icon name="add" /> Novo Servidor
        </button>
      </div>

      <div className="cards">
        <MetricCard
          icon="users"
          value={String(servidores.length)}
          label="Total de Servidores"
        />

        <MetricCard
          icon="user-check"
          value={String(quantidade("Ativo"))}
          label="Ativos"
        />

        <MetricCard
          icon="user-time"
          value={String(quantidade("Afastado"))}
          label="Afastados"
        />

        <MetricCard
          icon="user-shield"
          value={String(quantidade("Licença"))}
          label="Em Licença"
        />
      </div>

      <div className="card">
        <div className="filters">
          <div className="filter-search">
            <Icon name="search" />

            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por nome, matrícula ou cargo..."
            />
          </div>

          <select>
            <option>Todos os status</option>
          </select>

          <select>
            <option>Todas as secretarias</option>
          </select>
        </div>

        <div className="table-scroll">
          <table className="table">
            <thead>
              <tr>
                <th>Servidor</th>
                <th>Matrícula</th>
                <th>Cargo</th>
                <th>Secretaria</th>
                <th>Situação</th>
                <th>Ações</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <Message>Carregando servidores...</Message>
              ) : error ? (
                <Message>{error}</Message>
              ) : filtered.length === 0 ? (
                <Message>
                  Nenhum servidor encontrado. Os registros aparecerão aqui após
                  a conexão com o banco de dados.
                </Message>
              ) : (
                filtered.map((s) => (
                  <tr key={s.id}>
                    <td>
                      <div className="person">
                        <div className="avatar">{initials(s.nome)}</div>
                        <strong>{s.nome}</strong>
                      </div>
                    </td>

                    <td>{s.matricula}</td>
                    <td>{s.cargo}</td>
                    <td>{s.secretaria}</td>

                    <td>
                      <Status
                        tone={s.status === "Ativo" ? "green" : "yellow"}
                      >
                        {s.status}
                      </Status>
                    </td>

                    <td>
                      <button
                        className="icon-btn"
                        onClick={() => onProfile(s)}
                      >
                        <Icon name="eye" />
                      </button>

                      <button
                        className="icon-btn"
                        onClick={() => onProfile(s)}
                      >
                        <Icon name="edit" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function Message({ children }: { children: string }) {
  return (
    <tr>
      <td colSpan={6} className="table-message">
        {children}
      </td>
    </tr>
  );
}

function initials(name: string) {
  return name
    .split(" ")
    .map((x) => x[0])
    .slice(0, 2)
    .join("");
}
