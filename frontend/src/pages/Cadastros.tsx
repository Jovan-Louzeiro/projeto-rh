import { useEffect, useMemo, useState } from "react";
import Icon from "../components/Icon";
import { FormularioDinamicoContainer } from "../components/formularios/FormularioDinamicoContainer";
import {
  atualizarRegistroCadastro,
  criarRegistroCadastro,
  excluirRegistroCadastro,
  listarRegistrosCadastro,
  recursosCadastro,
  type RegistroCadastro,
  type RecursoCadastro,
} from "../services/cadastros";
import type { CampoFormularioConfig } from "../types/json-schema.types";
import { getCurrentUserInfo } from "../services/api";

type Relacoes = { paises: RegistroCadastro[]; estados: RegistroCadastro[] };
const recursosPermitidosRh = new Set([
  "pais",
  "estados",
  "municipios",
  "cargo",
  "funcao",
  "localizacaoDiferenciada",
  "departamento",
]);

export default function Cadastros() {
  const permissao = getCurrentUserInfo()?.permissao;
  const recursosDisponiveis = permissao === "ADMIN"
    ? recursosCadastro
    : permissao === "RH"
      ? recursosCadastro.filter(item => recursosPermitidosRh.has(item.path))
      : [];
  const [recurso, setRecurso] = useState<RecursoCadastro>(
    () => recursosDisponiveis[0] ?? recursosCadastro[0],
  );
  const [registros, setRegistros] = useState<RegistroCadastro[]>([]);
  const [relacoes, setRelacoes] = useState<Relacoes>({ paises: [], estados: [] });
  const [selecionado, setSelecionado] = useState<RegistroCadastro | null>(null);
  const [formularioAberto, setFormularioAberto] = useState(false);
  const [busca, setBusca] = useState("");
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [excluindoId, setExcluindoId] = useState<string | number | null>(null);
  const [versao, setVersao] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    Promise.all([
      listarRegistrosCadastro(recursosCadastro.find(item => item.path === "pais")!, controller.signal),
      listarRegistrosCadastro(recursosCadastro.find(item => item.path === "estados")!, controller.signal),
    ]).then(([paises, estados]) => setRelacoes({ paises, estados })).catch(() => {
      // A tela ainda pode listar e editar cadastros sem opções relacionais.
    });
    return () => controller.abort();
  }, [versao]);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setErro("");
    listarRegistrosCadastro(recurso, controller.signal)
      .then(setRegistros)
      .catch(error => {
        if (error instanceof Error && error.name === "AbortError") return;
        setErro(error instanceof Error ? error.message : "Não foi possível carregar os cadastros.");
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [recurso, versao]);

  const filtrados = useMemo(() => registros.filter(item =>
    Object.values(item).filter(value => value === null || ["string", "number", "boolean"].includes(typeof value))
      .join(" ").toLowerCase().includes(busca.toLowerCase())), [registros, busca]);

  const quantidadeAtivos = registros.filter(item => item.ativo !== false).length;
  const quantidadeInativos = registros.length - quantidadeAtivos;

  function fecharFormulario() {
    setFormularioAberto(false);
    setSelecionado(null);
  }

  function abrirNovoCadastro() {
    setSelecionado(null);
    setFormularioAberto(true);
    setErro("");
    setSucesso("");
  }

  function alterarRecurso(path: string) {
    const proximo = recursosDisponiveis.find(item => item.path === path);
    if (!proximo) return;
    setRecurso(proximo);
    fecharFormulario();
    setBusca("");
    setErro("");
    setSucesso("");
  }

  async function excluir(item: RegistroCadastro) {
    const id = item[recurso.idKey] as string | number;
    if (!window.confirm(`Excluir permanentemente “${tituloPrincipal(item)}”?`)) return;
    setExcluindoId(id);
    setErro("");
    setSucesso("");
    try {
      await excluirRegistroCadastro(recurso, id);
      if (String(selecionado?.[recurso.idKey]) === String(id)) fecharFormulario();
      setSucesso(`${recurso.label} excluído com sucesso.`);
      setVersao(value => value + 1);
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Não foi possível excluir o registro.");
    } finally {
      setExcluindoId(null);
    }
  }

  function opcoesCampo(campo: RecursoCadastro["fields"][number]) {
    if (campo.options) return campo.options;
    const registrosRelacionados = campo.source === "paises" ? relacoes.paises : relacoes.estados;
    return registrosRelacionados.map(item => {
      const idKey = campo.source === "paises" ? "id_pais" : "id_estado";
      const nome = String(item.nome ?? "");
      const uf = item.uf ? ` (${item.uf})` : "";
      return { value: String(item[idKey] ?? ""), label: `${nome}${uf}` };
    });
  }

  const configuracoesCampos: Record<string, CampoFormularioConfig> = Object.fromEntries(
    recurso.fields.map(campo => [
      campo.name,
      {
        title: campo.label,
        ...(campo.required !== undefined ? { required: campo.required } : {}),
        ...(campo.type && campo.type !== "checkbox" ? { type: campo.type } : {}),
        ...(campo.type === "select" ? { options: opcoesCampo(campo) } : {}),
        ...(campo.name === "ativo" ? { defaultValue: true } : {}),
        ...(campo.type === "password" && selecionado
          ? { placeholder: "Deixe vazio para manter a senha atual" }
          : {}),
      },
    ]),
  );

  const tituloPrincipal = (item: RegistroCadastro) => String(item.descricao ?? item.nome ?? item.email ?? item[recurso.idKey] ?? "Registro");
  const podeGerenciarCadastros = permissao === "ADMIN" || permissao === "RH";

  async function salvar(dados: RegistroCadastro) {
    setErro("");
    setSucesso("");
    if (selecionado) {
      const id = selecionado[recurso.idKey] as string | number;
      await atualizarRegistroCadastro(recurso, id, dados);
      setSucesso(`${recurso.label} atualizado com sucesso.`);
    } else {
      await criarRegistroCadastro(recurso, dados);
      setSucesso(`${recurso.label} cadastrado com sucesso.`);
    }
    fecharFormulario();
    setVersao(value => value + 1);
  }

  return <div className="cadastros-page">
    <header className="page-head cadastros-page-head">
      <div className="cadastros-title">
        <span className="cadastros-title-icon"><Icon name="settings" /></span>
        <div>
          <span className="cadastros-eyebrow">Administração do sistema</span>
          <h1>Cadastros</h1>
          <p>Organize os dados de referência usados nos registros de servidores.</p>
        </div>
      </div>
      {podeGerenciarCadastros && <button className="btn primary cadastros-create-button" type="button" onClick={abrirNovoCadastro}>
        <Icon name="add" /> Novo cadastro
      </button>}
    </header>

    <section className="cadastros-stats" aria-label="Resumo dos cadastros">
      <article className="cadastros-stat">
        <span className="cadastros-stat-icon"><Icon name="apps" /></span>
        <div><span>Catálogos disponíveis</span><strong>{recursosDisponiveis.length}</strong><small>para o seu perfil</small></div>
      </article>
      <article className="cadastros-stat">
        <span className="cadastros-stat-icon"><Icon name="list" /></span>
        <div><span>Registros de {recurso.label.toLowerCase()}</span><strong>{registros.length}</strong><small>no catálogo selecionado</small></div>
      </article>
      <article className="cadastros-stat">
        <span className="cadastros-stat-icon"><Icon name="check-circle" /></span>
        <div><span>Registros ativos</span><strong>{quantidadeAtivos}</strong><small>{quantidadeInativos} inativos</small></div>
      </article>
    </section>

    <div className="cadastros-layout">
      <aside className="card cadastro-resource-picker" aria-label="Catálogos de cadastro">
        <div className="cadastro-resource-picker-heading">
          <div><span>MENU</span><h2>Catálogos</h2></div>
          <span className="cadastro-resource-total">{recursosDisponiveis.length}</span>
        </div>
        {Array.from(new Set(recursosDisponiveis.map(item => item.group))).map(grupo => {
          const itensDoGrupo = recursosDisponiveis.filter(item => item.group === grupo);
          return <section className="cadastro-resource-group" key={grupo}>
            <h3><span aria-hidden="true">{grupo.slice(0, 1)}</span>{grupo}<small>{itensDoGrupo.length}</small></h3>
            <div className="cadastro-resource-buttons">
              {itensDoGrupo.map(item => <button
                key={item.path}
                type="button"
                className={`cadastro-resource-button ${recurso.path === item.path ? "active" : ""}`}
                aria-pressed={recurso.path === item.path}
                onClick={() => alterarRecurso(item.path)}
              >
                <span>{item.label}</span>
                {recurso.path === item.path && <Icon name="angle-small-right" />}
              </button>)}
            </div>
          </section>;
        })}
      </aside>

      <main className="cadastros-main">
        <section className="card cadastro-resource-overview">
          <div className="cadastro-resource-heading">
            <span className="cadastro-resource-group-label">{recurso.group}</span>
            <h2>{recurso.label}</h2>
            <p>Consulte, pesquise e mantenha este catálogo atualizado.</p>
          </div>
          <div className="cadastro-resource-tools">
            <label className="filter-search cadastro-search">
              <Icon name="search" />
              <input
                type="search"
                aria-label={`Buscar ${recurso.label.toLowerCase()}`}
                value={busca}
                onChange={event => setBusca(event.target.value)}
                placeholder={`Buscar ${recurso.label.toLowerCase()}...`}
              />
            </label>
            {podeGerenciarCadastros && <button className="btn primary cadastro-inline-create" type="button" onClick={abrirNovoCadastro}>
              <Icon name="add" /><span>Novo</span>
            </button>}
          </div>
        </section>

        {(erro || sucesso) && <div className={`cadastro-feedback ${erro ? "is-error" : "is-success"}`} role={erro ? "alert" : "status"}>
          <Icon name={erro ? "exclamation" : "check"} />
          <span>{erro || sucesso}</span>
        </div>}

        {formularioAberto && podeGerenciarCadastros && <section className="card cadastro-admin-form">
          <div className="cadastro-form-heading">
            <div>
              <span>{selecionado ? "EDIÇÃO" : "NOVO REGISTRO"}</span>
              <h2>{selecionado ? `Editar ${recurso.label}` : `Novo ${recurso.label}`}</h2>
              <p>Preencha os campos para {selecionado ? "atualizar este item." : "adicionar um item ao catálogo."}</p>
            </div>
            <button className="btn outline cadastro-close-form" type="button" onClick={fecharFormulario}>
              <Icon name="cross-small" /><span>Fechar</span>
            </button>
          </div>
          <FormularioDinamicoContainer
            key={selecionado ? `${recurso.path}-${String(selecionado[recurso.idKey])}` : `${recurso.path}-novo`}
            dominio={recurso.path}
            operacao={selecionado ? "atualizar" : "adicionar"}
            valoresIniciais={selecionado ?? undefined}
            campos={configuracoesCampos}
            textoSalvar={selecionado ? "Salvar alterações" : "Cadastrar"}
            textoSalvando="Salvando..."
            onSubmit={salvar}
            onCancel={fecharFormulario}
          />
        </section>}

        <section className="card table-card cadastro-records-card">
          <div className="cadastro-records-heading">
            <div><h2>Registros</h2><p>Itens cadastrados em {recurso.label.toLowerCase()}.</p></div>
            <span className="cadastro-record-count">{filtrados.length} {filtrados.length === 1 ? "resultado" : "resultados"}</span>
          </div>
          <div className="table-scroll"><table className="table cadastro-table">
            <thead><tr><th>Cadastro</th><th>Informações</th><th>Status</th><th>Ações</th></tr></thead>
            <tbody>
              {loading ? <Message>Carregando...</Message> : erro && !registros.length ? <Message>{erro}</Message> : filtrados.length === 0 ? <Message>{busca ? "Nenhum resultado para esta busca." : "Nenhum registro cadastrado ainda."}</Message> : filtrados.map(item => {
                const id = item[recurso.idKey];
                const titulo = tituloPrincipal(item);
                const detalhes = recurso.fields
                  .filter(field => field.type !== "password" && field.type !== "checkbox" && field.name !== "descricao" && field.name !== "nome")
                  .map(field => {
                    let value = item[field.name];
                    if (field.name === "pais_id") value = relacoes.paises.find(pais => String(pais.id_pais) === String(value))?.nome ?? value;
                    if (field.name === "estado_id") {
                      const estado = relacoes.estados.find(option => String(option.id_estado) === String(value));
                      value = estado ? `${String(estado.nome)} (${String(estado.uf)})` : value;
                    }
                    return value === null || value === undefined || value === ""
                      ? null
                      : { label: field.label, value: String(value) };
                  })
                  .filter((detail): detail is { label: string; value: string } => detail !== null);
                const ativo = item.ativo !== false;
                return <tr key={String(id)}>
                  <td>
                    <div className="cadastro-record-title">
                      <span className="cadastro-record-avatar">{titulo.slice(0, 1).toUpperCase()}</span>
                      <div><strong>{titulo}</strong><small>ID {String(id)}</small></div>
                    </div>
                  </td>
                  <td>
                    {detalhes.length ? <div className="cadastro-detail-list">{detalhes.map(detail =>
                      <span key={detail.label}><b>{detail.label}</b>{detail.value}</span>,
                    )}</div> : <span className="cadastro-no-details">Sem informações adicionais</span>}
                  </td>
                  <td><span className={`cadastro-status ${ativo ? "is-active" : "is-inactive"}`}><i />{ativo ? "Ativo" : "Inativo"}</span></td>
                  <td>
                    <div className="cadastro-actions">
                      {podeGerenciarCadastros && <>
                        <button className="btn outline cadastro-row-action" type="button" onClick={() => { setSelecionado(item); setFormularioAberto(true); setErro(""); setSucesso(""); }}>
                          <Icon name="edit" /><span>Editar</span>
                        </button>
                        <button className="danger-button cadastro-row-action" type="button" disabled={excluindoId !== null} onClick={() => excluir(item)}>
                          <Icon name="trash" /><span>{String(excluindoId) === String(id) ? "Excluindo..." : "Excluir"}</span>
                        </button>
                      </>}
                    </div>
                  </td>
                </tr>;
              })}
            </tbody>
          </table></div>
        </section>
      </main>
    </div>
  </div>;
}

function Message({ children }: { children: string }) {
  return <tr><td className="table-message" colSpan={4}>{children}</td></tr>;
}
