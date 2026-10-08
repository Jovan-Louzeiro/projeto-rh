import { useEffect, useState } from "react";
import type { Servidor } from "../types";
import { listarServidores } from "../services/servidores";

type Props = {
  onProfile: (servidor: Servidor) => void;
  onNew: () => void;
};

export function Servidores({
  onProfile,
  onNew,
}: Props) {
  const [servidores, setServidores] = useState<Servidor[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  async function carregarServidores() {
    try {
      setLoading(true);
      setErro("");

      const lista = await listarServidores();

      setServidores(lista);
    } catch (error) {
      console.error(error);

      setErro(
        error instanceof Error
          ? error.message
          : "Não foi possível carregar os servidores."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarServidores();
  }, []);

  return (
    <div className="page">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
        }}
      >
        <div>
          <h1>Servidores</h1>

          <p>
            Lista de servidores cadastrados no RH Digital.
          </p>
        </div>

        <button
          type="button"
          onClick={onNew}
        >
          Novo servidor
        </button>
      </div>

      {loading && (
        <p className="table-message">
          Carregando servidores...
        </p>
      )}

      {!loading && erro && (
        <div className="form-error">
          <p>{erro}</p>

          <button
            type="button"
            onClick={carregarServidores}
          >
            Tentar novamente
          </button>
        </div>
      )}

      {!loading && !erro && servidores.length === 0 && (
        <div className="table-message">
          <p>
            Nenhum servidor cadastrado.
          </p>
        </div>
      )}

      {!loading && !erro && servidores.length > 0 && (
        <div
          style={{
            overflowX: "auto",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
            }}
          >
            <thead>
              <tr>
                <th
                  style={{
                    textAlign: "left",
                    padding: "12px",
                  }}
                >
                  ID
                </th>

                <th
                  style={{
                    textAlign: "left",
                    padding: "12px",
                  }}
                >
                  Nome
                </th>

                <th
                  style={{
                    textAlign: "left",
                    padding: "12px",
                  }}
                >
                  CPF
                </th>

                <th
                  style={{
                    textAlign: "left",
                    padding: "12px",
                  }}
                >
                  Status
                </th>

                <th
                  style={{
                    textAlign: "right",
                    padding: "12px",
                  }}
                >
                  Ações
                </th>
              </tr>
            </thead>

            <tbody>
              {servidores.map((servidor) => (
                <tr key={servidor.id}>
                  <td
                    style={{
                      padding: "12px",
                    }}
                  >
                    {servidor.id}
                  </td>

                  <td
                    style={{
                      padding: "12px",
                    }}
                  >
                    {servidor.nome}
                  </td>

                  <td
                    style={{
                      padding: "12px",
                    }}
                  >
                    {servidor.cpf || "-"}
                  </td>

                  <td
                    style={{
                      padding: "12px",
                    }}
                  >
                    {servidor.status}
                  </td>

                  <td
                    style={{
                      padding: "12px",
                      textAlign: "right",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        onProfile(servidor)
                      }
                    >
                      Ver perfil
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Servidores;