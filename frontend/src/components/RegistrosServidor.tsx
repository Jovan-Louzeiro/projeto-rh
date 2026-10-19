import { useEffect, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import Icon from "./Icon";
import Modal from "./Modal";
import type { OpcoesServidorCompletas, OpcaoServidor } from "../services/opcoesServidor";
import {
  atualizarContato,
  atualizarHistoricoFuncional,
  atualizarMatricula,
  criarContato,
  criarHistoricoFuncional,
  criarMatricula,
  excluirContato,
  excluirHistoricoFuncional,
  excluirMatricula,
  listarContatos,
  listarHistoricoFuncional,
  listarMatriculas,
} from "../services/registrosServidor";
import type {
  Contato,
  HistoricoFuncional,
  Matricula,
  NovoContato,
  NovoHistoricoFuncional,
  NovaMatricula,
  TipoContato,
} from "../services/registrosServidor";

type Props = { idServidor: string | number; opcoes: OpcoesServidorCompletas };
type FormTarget =
  | { tipo: "contato"; item?: Contato }
  | { tipo: "matricula"; item?: Matricula }
  | { tipo: "historico"; matricula: Matricula; item?: HistoricoFuncional };

const inputDate = (value: string | null | undefined) => value ? value.slice(0, 10) : "";
const formatDate = (value: string | null | undefined) => {
  const date = inputDate(value);
  return date ? date.split("-").reverse().join("/") : "—";
};
const optionLabel = (options: OpcaoServidor[], id: number | null) =>
  options.find(option => String(option.id) === String(id))?.descricao ?? "Não informado";

export default function RegistrosServidor({ idServidor, opcoes }: Props) {
  const [contatos, setContatos] = useState<Contato[]>([]);
  const [matriculas, setMatriculas] = useState<Matricula[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [form, setForm] = useState<FormTarget | null>(null);
  const [atualizacao, setAtualizacao] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setCarregando(true);
    setErro("");
    Promise.all([
      listarContatos(idServidor, controller.signal),
      listarMatriculas(idServidor, controller.signal),
    ]).then(([listaContatos, listaMatriculas]) => {
      setContatos(listaContatos);
      setMatriculas(listaMatriculas);
    }).catch(error => {
      if (controller.signal.aborted) return;
      setErro(error instanceof Error ? error.message : "Não foi possível carregar contatos e matrículas.");
    }).finally(() => {
      if (!controller.signal.aborted) setCarregando(false);
    });
    return () => controller.abort();
  }, [idServidor, atualizacao]);

  async function removerContato(item: Contato) {
    if (!window.confirm(`Excluir o contato ${item.contato}?`)) return;
    try {
      await excluirContato(idServidor, item.id_contato);
      setAtualizacao(value => value + 1);
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Não foi possível excluir o contato.");
    }
  }

  async function removerMatricula(item: Matricula) {
    if (!window.confirm(`Excluir a matrícula ${item.numero}? O histórico funcional associado também poderá ser removido.`)) return;
    try {
      await excluirMatricula(idServidor, item.id_matricula);
      setAtualizacao(value => value + 1);
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Não foi possível excluir a matrícula.");
    }
  }

  return (
    <div className="registro-servidor">
      {erro && <div className="form-error" role="alert">
        {erro}
        <button type="button" className="btn outline" onClick={() => setAtualizacao(value => value + 1)}>Recarregar dados</button>
      </div>}
      {carregando ? <p className="table-message">Carregando contatos e matrículas...</p> : <>
        <section className="document-profile">
          <div className="section-heading">
            <h4>Contatos</h4>
            <button type="button" className="btn primary" onClick={() => setForm({ tipo: "contato" })}>
              <Icon name="add" /> Novo contato
            </button>
          </div>
          {!contatos.length ? <p className="muted">Nenhum contato cadastrado.</p> : (
            <div className="registro-lista">
              {contatos.map(item => (
                <article className="registro-item" key={item.id_contato}>
                  <div>
                    <strong>{item.contato}</strong>
                    <p>{rotuloTipoContato(item.tipo_contato)}{item.principal ? " · Principal" : ""}{!item.ativo ? " · Inativo" : ""}</p>
                  </div>
                  <div className="registro-acoes">
                    <button type="button" className="btn outline" onClick={() => setForm({ tipo: "contato", item })}>Editar</button>
                    <button type="button" className="btn outline" onClick={() => void removerContato(item)}>Excluir</button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="document-profile">
          <div className="section-heading">
            <h4>Matrículas e histórico funcional</h4>
            <button type="button" className="btn primary" onClick={() => setForm({ tipo: "matricula" })}>
              <Icon name="add" /> Nova matrícula
            </button>
          </div>
          {!matriculas.length ? <p className="muted">Nenhuma matrícula cadastrada.</p> : (
            <div className="registro-lista">
              {matriculas.map(item => (
                <MatriculaItem
                  key={item.id_matricula}
                  idServidor={idServidor}
                  matricula={item}
                  opcoes={opcoes}
                  onEdit={() => setForm({ tipo: "matricula", item })}
                  onDelete={() => void removerMatricula(item)}
                  onNewHistorico={() => setForm({ tipo: "historico", matricula: item })}
                  onEditHistorico={historico => setForm({ tipo: "historico", matricula: item, item: historico })}
                  onHistoricoChanged={() => setAtualizacao(value => value + 1)}
                />
              ))}
            </div>
          )}
        </section>
      </>}

      {form && <RegistroModal
        idServidor={idServidor}
        target={form}
        opcoes={opcoes}
        onClose={() => setForm(null)}
        onSaved={() => setAtualizacao(value => value + 1)}
      />}
    </div>
  );
}

function MatriculaItem({
  idServidor,
  matricula,
  opcoes,
  onEdit,
  onDelete,
  onNewHistorico,
  onEditHistorico,
  onHistoricoChanged,
}: {
  idServidor: string | number;
  matricula: Matricula;
  opcoes: OpcoesServidorCompletas;
  onEdit: () => void;
  onDelete: () => void;
  onNewHistorico: () => void;
  onEditHistorico: (item: HistoricoFuncional) => void;
  onHistoricoChanged: () => void;
}) {
  const [expandido, setExpandido] = useState(false);
  return (
    <article className="registro-item registro-matricula">
      <div className="registro-item-cabecalho">
        <div>
          <strong>Matrícula {matricula.numero}</strong>
          <p>Admissão: {formatDate(matricula.admissao)} · {matricula.ativo ? "Ativa" : "Inativa"}</p>
        </div>
        <div className="registro-acoes">
          <button type="button" className="btn outline" onClick={onEdit}>Editar</button>
          <button type="button" className="btn outline" onClick={onDelete}>Excluir</button>
          <button type="button" className="btn outline" aria-expanded={expandido} onClick={() => setExpandido(value => !value)}>
            {expandido ? "Ocultar histórico" : "Ver histórico"}
          </button>
        </div>
      </div>
      {expandido && <HistoricoMatricula
        idServidor={idServidor}
        matricula={matricula}
        opcoes={opcoes}
        onNew={onNewHistorico}
        onEdit={onEditHistorico}
        onChanged={onHistoricoChanged}
      />}
    </article>
  );
}

function HistoricoMatricula({
  idServidor,
  matricula,
  opcoes,
  onNew,
  onEdit,
  onChanged,
}: {
  idServidor: string | number;
  matricula: Matricula;
  opcoes: OpcoesServidorCompletas;
  onNew: () => void;
  onEdit: (item: HistoricoFuncional) => void;
  onChanged: () => void;
}) {
  const [items, setItems] = useState<HistoricoFuncional[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [versao, setVersao] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setCarregando(true);
    setErro("");
    listarHistoricoFuncional(idServidor, matricula.id_matricula, controller.signal)
      .then(setItems)
      .catch(error => {
        if (!controller.signal.aborted) setErro(error instanceof Error ? error.message : "Não foi possível carregar o histórico funcional.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setCarregando(false);
      });
    return () => controller.abort();
  }, [idServidor, matricula.id_matricula, versao]);

  async function remover(item: HistoricoFuncional) {
    if (!window.confirm("Excluir este registro do histórico funcional?")) return;
    try {
      await excluirHistoricoFuncional(idServidor, matricula.id_matricula, item.id_historico_funcional);
      setVersao(value => value + 1);
      onChanged();
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Não foi possível excluir o histórico funcional.");
    }
  }

  return (
    <div className="historico-funcional">
      <div className="section-heading">
        <h5>Histórico funcional</h5>
        <button type="button" className="btn outline" onClick={onNew}><Icon name="add" /> Adicionar período</button>
      </div>
      {erro && <p className="form-error" role="alert">
        {erro}
        <button type="button" className="btn outline" onClick={() => setVersao(value => value + 1)}>Recarregar histórico</button>
      </p>}
      {carregando ? <p>Carregando histórico...</p> : !items.length ? <p className="muted">Nenhum período funcional registrado.</p> : (
        <div className="registro-lista">
          {items.map(item => (
            <article className="historico-item" key={item.id_historico_funcional}>
              <div className="info-grid">
                <Info label="Cargo" value={optionLabel(opcoes.cargos, item.cargo_id)} />
                <Info label="Função" value={optionLabel(opcoes.funcoes, item.funcao_id)} />
                <Info label="Departamento" value={optionLabel(opcoes.departamentos, item.departamento_id)} />
                <Info label="Vínculo" value={optionLabel(opcoes.tiposVinculo, item.tipo_vinculo_id)} />
                <Info label="Situação" value={optionLabel(opcoes.situacoes, item.situacao_id)} />
                <Info label="Período" value={`${formatDate(item.data_inicio)} – ${formatDate(item.data_fim)}`} />
              </div>
              <div className="registro-acoes">
                <button type="button" className="btn outline" onClick={() => onEdit(item)}>Editar</button>
                <button type="button" className="btn outline" onClick={() => void remover(item)}>Excluir</button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

function Info({ label, value }: { label: string; value: ReactNode }) {
  return <div className="info"><small>{label}</small><strong>{value}</strong></div>;
}

function RegistroModal({
  idServidor,
  target,
  opcoes,
  onClose,
  onSaved,
}: {
  idServidor: string | number;
  target: FormTarget;
  opcoes: OpcoesServidorCompletas;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);
  const existente = target.item;
  const title = target.tipo === "contato"
    ? `${existente ? "Editar" : "Novo"} contato`
    : target.tipo === "matricula"
      ? `${existente ? "Editar" : "Nova"} matrícula`
      : `${existente ? "Editar" : "Adicionar"} histórico funcional`;

  async function salvar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErro("");
    setSalvando(true);
    const formData = new FormData(event.currentTarget);
    try {
      if (target.tipo === "contato") {
        const tipo = String(formData.get("tipo_contato")) as TipoContato;
        const contato = String(formData.get("contato") ?? "").trim();
        const dados: NovoContato = {
          tipo_contato: tipo,
          contato: tipo === "EMAIL" ? contato : contato.replace(/\D/g, ""),
          principal: formData.get("principal") === "on",
          ativo: formData.get("ativo") === "on",
        };
        if (target.item) await atualizarContato(idServidor, target.item.id_contato, dados);
        else await criarContato(idServidor, dados);
      } else if (target.tipo === "matricula") {
        const dados: NovaMatricula = {
          numero: String(formData.get("numero") ?? "").trim(),
          admissao: String(formData.get("admissao") ?? ""),
          ativo: formData.get("ativo") === "on",
        };
        if (target.item && "id_matricula" in target.item) await atualizarMatricula(idServidor, target.item.id_matricula, dados);
        else await criarMatricula(idServidor, dados);
      } else {
        const dados: NovoHistoricoFuncional = {
          matricula_id: target.matricula.id_matricula,
          cargo_id: Number(formData.get("cargo_id")),
          funcao_id: Number(formData.get("funcao_id")),
          departamento_id: Number(formData.get("departamento_id")),
          tipo_vinculo_id: Number(formData.get("tipo_vinculo_id")),
          situacao_id: Number(formData.get("situacao_id")),
          data_inicio: String(formData.get("data_inicio") ?? ""),
          ...(formData.get("data_fim") ? { data_fim: String(formData.get("data_fim")) } : {}),
        };
        if (target.item && "id_historico_funcional" in target.item) {
          await atualizarHistoricoFuncional(idServidor, target.matricula.id_matricula, target.item.id_historico_funcional, dados);
        } else {
          await criarHistoricoFuncional(idServidor, target.matricula.id_matricula, dados);
        }
      }
      onSaved();
      onClose();
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Não foi possível salvar os dados.");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <Modal title={title} onClose={onClose}>
      <form className="form-grid registro-form" onSubmit={salvar}>
        {target.tipo === "contato" && <ContatoFields item={target.item} />}
        {target.tipo === "matricula" && <MatriculaFields item={target.item} />}
        {target.tipo === "historico" && <HistoricoFields item={target.item} opcoes={opcoes} />}
        {erro && <p className="form-error full-col" role="alert">{erro}</p>}
        <div className="form-actions full-col">
          <button type="button" className="btn outline" onClick={onClose} disabled={salvando}>Cancelar</button>
          <button type="submit" className="btn primary" disabled={salvando}>{salvando ? "Salvando..." : "Salvar"}</button>
        </div>
      </form>
    </Modal>
  );
}

function ContatoFields({ item }: { item?: Contato }) {
  const [tipo, setTipo] = useState<TipoContato>(item?.tipo_contato ?? "TELEFONE_MOVEL");
  return <>
    <label>Tipo de contato
      <select name="tipo_contato" value={tipo} onChange={event => setTipo(event.target.value as TipoContato)}>
        <option value="TELEFONE_MOVEL">Celular</option>
        <option value="TELEFONE_FIXO">Telefone fixo</option>
        <option value="EMAIL">E-mail</option>
      </select>
    </label>
    <label>{tipo === "EMAIL" ? "E-mail" : "Telefone com DDD"}
      <input
        name="contato"
        type={tipo === "EMAIL" ? "email" : "tel"}
        inputMode={tipo === "EMAIL" ? "email" : "numeric"}
        pattern={tipo === "EMAIL" ? undefined : tipo === "TELEFONE_MOVEL" ? "\\d{11}" : "\\d{10}"}
        maxLength={tipo === "EMAIL" ? 150 : tipo === "TELEFONE_MOVEL" ? 11 : 10}
        defaultValue={item?.contato ?? ""}
        required
        placeholder={tipo === "EMAIL" ? "nome@exemplo.com" : tipo === "TELEFONE_MOVEL" ? "DDD + 9 dígitos" : "DDD + 8 dígitos"}
      />
    </label>
    <label className="checkbox-row"><input type="checkbox" name="principal" defaultChecked={item?.principal ?? false} /> Contato principal</label>
    <label className="checkbox-row"><input type="checkbox" name="ativo" defaultChecked={item?.ativo ?? true} /> Contato ativo</label>
  </>;
}

function MatriculaFields({ item }: { item?: Matricula }) {
  return <>
    <label>Número da matrícula
      <input name="numero" maxLength={50} defaultValue={item?.numero ?? ""} required />
    </label>
    <label>Data de admissão
      <input name="admissao" type="date" defaultValue={inputDate(item?.admissao)} required />
    </label>
    <label className="checkbox-row"><input type="checkbox" name="ativo" defaultChecked={item?.ativo ?? true} /> Matrícula ativa</label>
  </>;
}

function HistoricoFields({ item, opcoes }: { item?: HistoricoFuncional; opcoes: OpcoesServidorCompletas }) {
  const campos: { name: keyof HistoricoFuncional; label: string; items: OpcaoServidor[] }[] = [
    { name: "cargo_id", label: "Cargo", items: opcoes.cargos },
    { name: "funcao_id", label: "Função", items: opcoes.funcoes },
    { name: "departamento_id", label: "Departamento", items: opcoes.departamentos },
    { name: "tipo_vinculo_id", label: "Tipo de vínculo", items: opcoes.tiposVinculo },
    { name: "situacao_id", label: "Situação", items: opcoes.situacoes },
  ];
  return <>
    {campos.map(campo => (
      <label key={campo.name}>{campo.label}
        <select name={campo.name} defaultValue={item?.[campo.name] == null ? "" : String(item[campo.name])} required>
          <option value="">Selecione</option>
          {campo.items.map(option => <option key={option.id} value={option.id}>{option.descricao}</option>)}
        </select>
      </label>
    ))}
    <label>Data de início
      <input name="data_inicio" type="date" defaultValue={inputDate(item?.data_inicio)} required />
    </label>
    <label>Data de término
      <input name="data_fim" type="date" defaultValue={inputDate(item?.data_fim)} />
    </label>
  </>;
}

function rotuloTipoContato(tipo: TipoContato): string {
  if (tipo === "TELEFONE_MOVEL") return "Celular";
  if (tipo === "TELEFONE_FIXO") return "Telefone fixo";
  return "E-mail";
}
