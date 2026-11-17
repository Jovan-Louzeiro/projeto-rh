import { useEffect, useMemo, useState } from "react";
import type { LicencaAfastamento, SituacaoLicenca } from "../types";
import {
  baixarDocumentoLicenca,
  cancelarLicenca,
  listarLicencas,
  salvarLicenca,
} from "../services/licencas";
import Icon from "../components/Icon";
import Modal from "../components/Modal";
import Status from "../components/Status";

const situacoes: SituacaoLicenca[] = [
  "Aprovada",
  "Em andamento",
  "Encerrada",
  "Cancelada",
];

export default function Licencas() {
  const [items, setItems] = useState<LicencaAfastamento[]>([]);
  const [query, setQuery] = useState("");
  const [filtro, setFiltro] = useState<"Todos" | SituacaoLicenca>("Todos");
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [selecionada, setSelecionada] = useState<LicencaAfastamento | null>(null);
  const [editando, setEditando] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [acaoId, setAcaoId] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    listarLicencas(controller.signal)
      .then(setItems)
      .catch((error: unknown) => {
        if (!controller.signal.aborted) {
          setErro(error instanceof Error ? error.message : "Não foi possível carregar as licenças.");
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, []);

  const filtrados = useMemo(() => {
    const termo = query.trim().toLowerCase();
    return items.filter((item) => {
      const combinaSituacao = filtro === "Todos" || item.situacao === filtro;
      const combinaBusca = !termo || [
        item.servidor,
        item.matricula,
        item.tipo,
        item.numeroDocumento,
      ].join(" ").toLowerCase().includes(termo);
      return combinaSituacao && combinaBusca;
    });
  }, [items, filtro, query]);

  function abrir(item: LicencaAfastamento, editar: boolean) {
    setErro("");
    setArquivo(null);
    setEditando(editar);
    setSelecionada(item);
  }

  async function salvarEdicao() {
    if (!selecionada) return;
    const mensagem = validar(selecionada);
    if (mensagem) {
      setErro(mensagem);
      return;
    }

    setSalvando(true);
    setErro("");
    try {
      const salvo = await salvarLicenca(semId(selecionada), selecionada.id, arquivo);
      setItems((atuais) => atuais.map((item) => item.id === salvo.id ? salvo : item));
      setSelecionada(null);
      setArquivo(null);
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Não foi possível salvar a licença.");
    } finally {
      setSalvando(false);
    }
  }

  async function cancelar(item: LicencaAfastamento) {
    if (!window.confirm(`Cancelar o registro de ${item.servidor}?`)) return;
    setAcaoId(item.id);
    setErro("");
    try {
      const atualizado = await cancelarLicenca(item.id);
      setItems((atuais) => atuais.map((registro) => registro.id === atualizado.id ? atualizado : registro));
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Não foi possível cancelar a licença.");
    } finally {
      setAcaoId("");
    }
  }

  async function baixarDocumento(item: LicencaAfastamento) {
    try {
      const blob = await baixarDocumentoLicenca(item.id);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = item.documento || "documento-licenca";
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Não foi possível baixar o documento.");
    }
  }

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Licenças e Afastamentos</h1>
          <p>Controle de licenças, afastamentos e retornos.</p>
        </div>
      </div>

      <div className="card table-card">
        <div className="filters">
          <div className="filter-search">
            <Icon name="search" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar servidor ou tipo..." />
          </div>
          <select aria-label="Filtrar por situação" value={filtro} onChange={(event) => setFiltro(event.target.value as "Todos" | SituacaoLicenca)}>
            <option value="Todos">Todas as situações</option>
            {situacoes.map((situacao) => <option key={situacao} value={situacao}>{situacao}</option>)}
          </select>
        </div>

        {erro && !selecionada && <p className="form-error" role="alert">{erro}</p>}

        <div className="table-scroll">
          <table className="table">
            <thead>
              <tr>
                <th>Servidor</th>
                <th>Tipo</th>
                <th>Início</th>
                <th>Término</th>
                <th>Dias</th>
                <th>Situação</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <Mensagem>Carregando licenças...</Mensagem>
              ) : filtrados.length === 0 ? (
                <Mensagem>{erro ? "Não foi possível carregar os registros." : "Nenhuma licença ou afastamento encontrado."}</Mensagem>
              ) : filtrados.map((item) => (
                <tr key={item.id}>
                  <td>{item.servidor}</td>
                  <td>{item.tipo}</td>
                  <td>{data(item.inicio)}</td>
                  <td>{item.semDataTermino ? "Sem previsão" : data(item.termino)}</td>
                  <td>{item.dias ?? "—"}</td>
                  <td><Status tone={tom(item.situacao)}>{item.situacao}</Status></td>
                  <td className="action-buttons">
                    <button className="icon-btn" type="button" title="Visualizar" aria-label="Visualizar" onClick={() => abrir(item, false)}>
                      <Icon name="eye" />
                    </button>
                    {item.situacao !== "Cancelada" && (
                      <button className="icon-btn" type="button" title="Editar" aria-label="Editar" disabled={Boolean(acaoId)} onClick={() => abrir(item, true)}>
                        <Icon name="edit" />
                      </button>
                    )}
                    {item.situacao !== "Cancelada" && (
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

      {selecionada && (
        <Modal
          title={editando ? "Editar licença ou afastamento" : "Detalhes da licença ou afastamento"}
          onClose={() => {
            setSelecionada(null);
            setArquivo(null);
          }}
        >
          <div className="form-grid ferias-form">
            <Info label="Servidor" value={selecionada.servidor} />
            <Info label="Matrícula" value={selecionada.matricula} />
            <Info label="CPF" value={selecionada.cpf} />
            <Info label="Cargo" value={selecionada.cargo} />
            <Info label="Secretaria" value={selecionada.secretaria} />
            <Campo label="Tipo" value={selecionada.tipo} disabled={!editando} onChange={(value) => setSelecionada({ ...selecionada, tipo: value })} />
            <Campo label="Data de início" type="date" value={selecionada.inicio} disabled={!editando} onChange={(value) => setSelecionada({ ...selecionada, inicio: value })} />
            <Campo label="Data de término" type="date" value={selecionada.termino ?? ""} disabled={!editando || selecionada.semDataTermino} onChange={(value) => setSelecionada({ ...selecionada, termino: value || null })} />
            <label>
              Sem data de término
              <select
                disabled={!editando}
                value={selecionada.semDataTermino ? "sim" : "nao"}
                onChange={(event) => setSelecionada({
                  ...selecionada,
                  semDataTermino: event.target.value === "sim",
                  termino: event.target.value === "sim" ? null : selecionada.termino,
                })}
              >
                <option value="nao">Não</option>
                <option value="sim">Sim</option>
              </select>
            </label>
            <Info label="Dias" value={selecionada.semDataTermino ? "—" : String(diasEntre(selecionada.inicio, selecionada.termino) ?? "—")} />
            <Campo label="Previsão de retorno" type="date" value={selecionada.previsaoRetorno ?? ""} disabled={!editando} onChange={(value) => setSelecionada({ ...selecionada, previsaoRetorno: value || null })} />
            <label className="full-col">
              Documento/comprovante
              {editando && (
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
                  onChange={(event) => setArquivo(event.target.files?.[0] ?? null)}
                />
              )}
              <span>{(arquivo?.name ?? selecionada.documento) || "Nenhum documento anexado"}</span>
              {selecionada.documento && (
                <button className="btn outline" type="button" onClick={() => void baixarDocumento(selecionada)}>
                  <Icon name="download" /> Baixar documento
                </button>
              )}
            </label>
            <Campo label="Número do documento" value={selecionada.numeroDocumento} disabled={!editando} onChange={(value) => setSelecionada({ ...selecionada, numeroDocumento: value })} />
            <Campo label="Data do documento" type="date" value={selecionada.dataDocumento} disabled={!editando} onChange={(value) => setSelecionada({ ...selecionada, dataDocumento: value })} />
            <Campo label="Órgão emissor" value={selecionada.orgaoEmissor} disabled={!editando} onChange={(value) => setSelecionada({ ...selecionada, orgaoEmissor: value })} />
            <Info label="Situação" value={selecionada.situacao} />
            <label className="full-col">
              Observações
              <textarea maxLength={2000} readOnly={!editando} value={selecionada.observacoes} onChange={(event) => setSelecionada({ ...selecionada, observacoes: event.target.value })} />
            </label>
          </div>
          {erro && selecionada && <p className="form-error" role="alert">{erro}</p>}
          {editando && (
            <button className="btn primary modal-action" type="button" disabled={salvando} onClick={() => void salvarEdicao()}>
              {salvando ? "Salvando..." : "Salvar alterações"}
            </button>
          )}
        </Modal>
      )}
    </>
  );
}

function Mensagem({ children }: { children: string }) {
  return <tr><td colSpan={7} className="table-message">{children}</td></tr>;
}

function Info({ label, value }: { label: string; value?: string }) {
  return <label>{label}<input value={value || "—"} readOnly /></label>;
}

function Campo({
  label,
  type = "text",
  value,
  disabled,
  onChange,
}: {
  label: string;
  type?: string;
  value: string;
  disabled: boolean;
  onChange: (value: string) => void;
}) {
  return <label>{label}<input type={type} value={value} disabled={disabled} onChange={(event) => onChange(event.target.value)} /></label>;
}

function semId({ id: _id, ...dados }: LicencaAfastamento) {
  return dados;
}

function data(value: string | null) {
  return value ? value.split("-").reverse().join("/") : "—";
}

function diasEntre(inicio: string, termino: string | null): number | null {
  if (!inicio || !termino) return null;
  const inicioUtc = Date.parse(`${inicio}T00:00:00Z`);
  const terminoUtc = Date.parse(`${termino}T00:00:00Z`);
  return terminoUtc < inicioUtc ? 0 : Math.floor((terminoUtc - inicioUtc) / 86400000) + 1;
}

function validar(item: LicencaAfastamento) {
  if (!item.tipo.trim() || !item.inicio) return "Preencha o tipo e a data de início.";
  if (!item.semDataTermino && !item.termino) return "Informe a data de término ou selecione a opção sem data de término.";
  if (item.termino && item.termino < item.inicio) return "A data de término deve ser posterior à data de início.";
  return "";
}

function tom(situacao: SituacaoLicenca) {
  if (situacao === "Encerrada") return "green";
  if (situacao === "Cancelada") return "red";
  return "blue";
}
