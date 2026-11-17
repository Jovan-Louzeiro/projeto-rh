import { useEffect, useMemo, useState } from "react";
import type { Ferias as FeriasRegistro, Servidor, SituacaoFerias } from "../types";
import {
  cancelarFerias,
  listarFerias,
  salvarFerias,
  type DadosFerias,
} from "../services/ferias";
import { listarServidores } from "../services/servidores";
import Icon from "../components/Icon";
import Modal from "../components/Modal";
import Status from "../components/Status";

type FormDataFerias = Omit<DadosFerias, "servidorId"> & {
  id?: string;
  servidorId: string;
};

const situacoes: SituacaoFerias[] = ["Aprovada", "Em andamento", "Encerrada", "Cancelada"];

export default function Ferias() {
  const [registros, setRegistros] = useState<FeriasRegistro[]>([]);
  const [servidores, setServidores] = useState<Servidor[]>([]);
  const [query, setQuery] = useState("");
  const [situacaoFiltro, setSituacaoFiltro] = useState<"Todas" | SituacaoFerias>("Todas");
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [formErro, setFormErro] = useState("");
  const [form, setForm] = useState<FormDataFerias | null>(null);
  const [visualizando, setVisualizando] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [acaoId, setAcaoId] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function carregarDados() {
      try {
        const [listaFerias, listaServidores] = await Promise.all([
          listarFerias(controller.signal),
          listarServidores(controller.signal),
        ]);
        if (controller.signal.aborted) return;
        setRegistros(listaFerias);
        setServidores(listaServidores);
      } catch (error) {
        if (!controller.signal.aborted) {
          setErro(error instanceof Error ? error.message : "Não foi possível carregar os dados.");
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    void carregarDados();
    return () => controller.abort();
  }, []);

  const filtrados = useMemo(() => {
    const termo = query.trim().toLowerCase();
    return registros.filter((registro) => {
      const correspondeSituacao = situacaoFiltro === "Todas" || registro.situacao === situacaoFiltro;
      const correspondeBusca = !termo || [
        registro.servidor,
        registro.matricula,
        registro.cpf,
        registro.situacao,
      ].join(" ").toLowerCase().includes(termo);
      return correspondeSituacao && correspondeBusca;
    });
  }, [registros, query, situacaoFiltro]);

  const servidor = servidores.find((item) => String(item.id) === form?.servidorId);
  const dias = diasEntre(form?.inicio, form?.fim);

  function atualizar<K extends keyof FormDataFerias>(campo: K, valor: FormDataFerias[K]) {
    setForm((atual) => atual ? { ...atual, [campo]: valor } : atual);
  }

  function abrirEdicao(registro: FeriasRegistro, somenteLeitura = false) {
    setErro("");
    setFormErro("");
    setVisualizando(somenteLeitura);
    setForm({
      id: registro.id,
      servidorId: String(registro.servidorId),
      periodoAquisitivoInicio: registro.periodoAquisitivoInicio,
      periodoAquisitivoFim: registro.periodoAquisitivoFim,
      diasDireito: registro.diasDireito,
      inicio: registro.inicio,
      fim: registro.fim,
      abonoPecuniario: registro.abonoPecuniario,
      antecipacaoDecimoTerceiro: registro.antecipacaoDecimoTerceiro,
      observacoes: registro.observacoes,
    });
  }

  async function salvar() {
    if (!form) return;
    if (!form.id) {
      setFormErro("As férias devem ser cadastradas pelo perfil do servidor.");
      return;
    }
    const servidorSelecionado = servidores.find((item) => String(item.id) === form.servidorId);
    if (!servidorSelecionado) {
      setFormErro("Selecione um servidor cadastrado.");
      return;
    }

    const erroValidacao = validar(form, dias, registros);
    if (erroValidacao) {
      setFormErro(erroValidacao);
      return;
    }

    setSalvando(true);
    setFormErro("");
    try {
      const salvo = await salvarFerias(form, form.id);
      setRegistros((atuais) => atuais.map((item) => item.id === salvo.id ? salvo : item));
      setForm(null);
    } catch (error) {
      setFormErro(error instanceof Error ? error.message : "Não foi possível salvar as férias.");
    } finally {
      setSalvando(false);
    }
  }

  async function cancelar(registro: FeriasRegistro) {
    if (!window.confirm(`Cancelar as férias de ${registro.servidor}?`)) return;
    setAcaoId(registro.id);
    setErro("");
    try {
      const atualizado = await cancelarFerias(registro.id);
      setRegistros((atuais) => atuais.map((item) => item.id === atualizado.id ? atualizado : item));
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Não foi possível cancelar as férias.");
    } finally {
      setAcaoId("");
    }
  }

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Férias</h1>
          <p>Controle dos períodos de férias registrados.</p>
        </div>
      </div>

      <div className="card table-card">
        <div className="filters">
          <div className="filter-search">
            <Icon name="search" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar servidor..." />
          </div>
          <select aria-label="Filtrar por situação" value={situacaoFiltro} onChange={(event) => setSituacaoFiltro(event.target.value as "Todas" | SituacaoFerias)}>
            <option value="Todas">Todas as situações</option>
            {situacoes.map((situacao) => <option key={situacao} value={situacao}>{situacao}</option>)}
          </select>
        </div>

        {erro && <p className="form-error" role="alert">{erro}</p>}

        <div className="table-scroll">
          <table className="table">
            <thead>
              <tr>
                <th>Servidor</th>
                <th>Período aquisitivo</th>
                <th>Período de férias</th>
                <th>Dias</th>
                <th>Situação</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <Mensagem>Carregando dados...</Mensagem>
              ) : filtrados.length === 0 ? (
                <Mensagem>{erro ? "Não foi possível carregar os registros." : "Nenhum registro de férias encontrado."}</Mensagem>
              ) : filtrados.map((registro) => (
                <tr key={registro.id}>
                  <td>{registro.servidor}</td>
                  <td>{periodo(registro.periodoAquisitivoInicio, registro.periodoAquisitivoFim)}</td>
                  <td>{periodo(registro.inicio, registro.fim)}</td>
                  <td>{registro.dias}</td>
                  <td><Status tone={tom(registro.situacao)}>{registro.situacao}</Status></td>
                  <td className="action-buttons">
                    <button className="icon-btn" title="Visualizar" aria-label="Visualizar" onClick={() => abrirEdicao(registro, true)}>
                      <Icon name="eye" />
                    </button>
                    {registro.situacao !== "Cancelada" && (
                      <button className="icon-btn" title="Editar" aria-label="Editar" disabled={Boolean(acaoId)} onClick={() => abrirEdicao(registro)}>
                        <Icon name="edit" />
                      </button>
                    )}
                    {registro.situacao !== "Cancelada" && (
                      <button className="icon-btn danger" title="Cancelar" aria-label="Cancelar" disabled={Boolean(acaoId)} onClick={() => void cancelar(registro)}>
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

      {form && (
        <Modal title={visualizando ? "Detalhes das férias" : "Editar férias"} onClose={() => setForm(null)}>
          <div className="form-grid ferias-form">
            <label className="full-col">
              Servidor
              <select disabled={visualizando || Boolean(form.id)} value={form.servidorId} onChange={(event) => atualizar("servidorId", event.target.value)} required>
                <option value="">Selecione o servidor</option>
                {servidores.map((item) => <option key={String(item.id)} value={String(item.id)}>{item.nome}</option>)}
              </select>
            </label>
            <Info label="Matrícula" value={servidor?.matricula} />
            <Info label="CPF" value={servidor?.cpf} />
            <Info label="Cargo" value={servidor?.cargo} />
            <Info label="Secretaria" value={servidor?.secretaria} />
            <Campo label="Início do período aquisitivo" value={form.periodoAquisitivoInicio} disabled={visualizando} onChange={(value) => atualizar("periodoAquisitivoInicio", value)} />
            <Campo label="Fim do período aquisitivo" value={form.periodoAquisitivoFim} disabled={visualizando} onChange={(value) => atualizar("periodoAquisitivoFim", value)} />
            <label>
              Dias de direito
              <input type="number" min="1" max="365" value={form.diasDireito} disabled={visualizando} onChange={(event) => atualizar("diasDireito", Number(event.target.value))} required />
            </label>
            <Campo label="Início das férias" value={form.inicio} disabled={visualizando} onChange={(value) => atualizar("inicio", value)} />
            <Campo label="Fim das férias" value={form.fim} disabled={visualizando} onChange={(value) => atualizar("fim", value)} />
            <Info label="Dias de férias" value={dias ? String(dias) : "—"} />
            <Booleano label="Abono pecuniário" value={form.abonoPecuniario} disabled={visualizando} onChange={(value) => atualizar("abonoPecuniario", value)} />
            <Booleano label="Antecipação do 13º" value={form.antecipacaoDecimoTerceiro} disabled={visualizando} onChange={(value) => atualizar("antecipacaoDecimoTerceiro", value)} />
            <label className="full-col">
              Observações
              <textarea maxLength={1000} disabled={visualizando} value={form.observacoes} onChange={(event) => atualizar("observacoes", event.target.value)} placeholder="Observações adicionais" />
            </label>
          </div>
          {formErro && <p className="form-error" role="alert">{formErro}</p>}
          {!visualizando && (
            <button className="btn primary modal-action" onClick={() => void salvar()} disabled={salvando}>
              {salvando ? "Salvando..." : "Salvar registro"}
            </button>
          )}
        </Modal>
      )}
    </>
  );
}

function Mensagem({ children }: { children: string }) {
  return <tr><td colSpan={6} className="table-message">{children}</td></tr>;
}

function Info({ label, value }: { label: string; value?: string }) {
  return <label>{label}<input value={value || "—"} readOnly /></label>;
}

function Campo({ label, value, disabled, onChange }: { label: string; value: string; disabled: boolean; onChange: (value: string) => void }) {
  return <label>{label}<input type="date" value={value} disabled={disabled} onChange={(event) => onChange(event.target.value)} required /></label>;
}

function Booleano({ label, value, disabled, onChange }: { label: string; value: boolean; disabled: boolean; onChange: (value: boolean) => void }) {
  return <label>{label}<select value={value ? "sim" : "nao"} disabled={disabled} onChange={(event) => onChange(event.target.value === "sim")}><option value="nao">Não</option><option value="sim">Sim</option></select></label>;
}

function diasEntre(inicio?: string, fim?: string) {
  if (!inicio || !fim) return 0;
  const inicioUtc = Date.parse(`${inicio}T00:00:00Z`);
  const fimUtc = Date.parse(`${fim}T00:00:00Z`);
  return fimUtc < inicioUtc ? 0 : Math.floor((fimUtc - inicioUtc) / 86400000) + 1;
}

function periodo(inicio: string, fim: string) {
  return `${formatarData(inicio)} a ${formatarData(fim)}`;
}

function formatarData(data: string) {
  return data ? data.split("-").reverse().join("/") : "—";
}

function validar(form: FormDataFerias, dias: number, registros: FeriasRegistro[]) {
  if (!form.periodoAquisitivoInicio || !form.periodoAquisitivoFim || !form.inicio || !form.fim) {
    return "Preencha todas as datas obrigatórias.";
  }
  if (form.periodoAquisitivoFim < form.periodoAquisitivoInicio) {
    return "O fim do período aquisitivo deve ser posterior ao início.";
  }
  if (form.fim < form.inicio) {
    return "O fim das férias deve ser posterior ao início.";
  }
  if (form.diasDireito <= 0) {
    return "Os dias de direito devem ser maiores que zero.";
  }
  if (dias > form.diasDireito) {
    return "A quantidade de dias de férias não pode ser maior que os dias de direito.";
  }
  const sobreposta = registros.some((registro) =>
    registro.id !== form.id &&
    String(registro.servidorId) === form.servidorId &&
    registro.situacao !== "Cancelada" &&
    form.inicio <= registro.fim &&
    form.fim >= registro.inicio
  );
  return sobreposta ? "Já existe um período de férias sobreposto para este servidor." : "";
}

function tom(situacao: SituacaoFerias) {
  if (situacao === "Encerrada") return "green";
  if (situacao === "Cancelada") return "red";
  return "blue";
}
