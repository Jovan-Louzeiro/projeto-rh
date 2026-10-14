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

type Relacoes = { paises: RegistroCadastro[]; estados: RegistroCadastro[] };

export default function Cadastros() {
  const [recurso, setRecurso] = useState<RecursoCadastro>(recursosCadastro[0]);
  const [registros, setRegistros] = useState<RegistroCadastro[]>([]);
  const [relacoes, setRelacoes] = useState<Relacoes>({ paises: [], estados: [] });
  const [selecionado, setSelecionado] = useState<RegistroCadastro | null>(null);
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

  function alterarRecurso(path: string) {
    const proximo = recursosCadastro.find(item => item.path === path);
    if (!proximo) return;
    setRecurso(proximo);
    setSelecionado(null);
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
      if (String(selecionado?.[recurso.idKey]) === String(id)) setSelecionado(null);
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
    setSelecionado(null);
    setVersao(value => value + 1);
  }

  return <>
    <div className="page-head">
      <div><h1>Cadastros</h1><p>Gerencie domínios, localização e usuários do sistema.</p></div>
      <button className="btn primary" type="button" onClick={() => { setSelecionado(null); setErro(""); setSucesso(""); }}><Icon name="add" /> Novo cadastro</button>
    </div>

    <div className="card cadastro-resource-picker">
      {Array.from(new Set(recursosCadastro.map(item => item.group))).map(grupo => <section className="cadastro-resource-group" key={grupo}>
        <h2>{grupo}</h2>
        <div className="cadastro-resource-buttons">
          {recursosCadastro.filter(item => item.group === grupo).map(item => <button
            key={item.path}
            type="button"
            className={`cadastro-resource-button ${recurso.path === item.path ? "active" : ""}`}
            aria-pressed={recurso.path === item.path}
            onClick={() => alterarRecurso(item.path)}
          >{item.label}</button>)}
        </div>
      </section>)}
    </div>

    <div className="card cadastro-admin-toolbar">
      <div className="filter-search"><Icon name="search" /><input value={busca} onChange={event => setBusca(event.target.value)} placeholder={`Buscar ${recurso.label.toLowerCase()}...`} /></div>
    </div>

    {(erro || sucesso) && <p className={erro ? "form-error" : "form-success"} role={erro ? "alert" : "status"} style={{ whiteSpace: "pre-line" }}>{erro || sucesso}</p>}

    {selecionado !== null && <div className="card cadastro-admin-form">
      <div className="section-heading"><h2>Editar {recurso.label}</h2><button className="btn outline" type="button" onClick={() => setSelecionado(null)}>Fechar</button></div>
      <FormularioDinamicoContainer
        key={`${recurso.path}-${String(selecionado[recurso.idKey])}`}
        dominio={recurso.path}
        operacao="atualizar"
        valoresIniciais={selecionado}
        campos={configuracoesCampos}
        textoSalvar="Salvar alterações"
        textoSalvando="Salvando..."
        onSubmit={salvar}
        onCancel={() => setSelecionado(null)}
      />
    </div>}

    {selecionado === null && <div className="card cadastro-admin-form">
      <div className="section-heading"><h2>Novo {recurso.label}</h2></div>
      <FormularioDinamicoContainer
        key={`${recurso.path}-novo`}
        dominio={recurso.path}
        operacao="adicionar"
        campos={configuracoesCampos}
        textoSalvar="Cadastrar"
        textoSalvando="Salvando..."
        onSubmit={salvar}
        onCancel={() => setSelecionado(null)}
      />
    </div>}

    <div className="card table-card">
      <h2 className="section-title">Registros de {recurso.label}</h2>
      <div className="table-scroll"><table className="table">
        <thead><tr><th>Cadastro</th><th>Informações</th><th>Status</th><th>Ações</th></tr></thead>
        <tbody>
          {loading ? <Message>Carregando...</Message> : erro && !registros.length ? <Message>{erro}</Message> : filtrados.length === 0 ? <Message>Nenhum registro encontrado.</Message> : filtrados.map(item => {
            const id = item[recurso.idKey];
            const detalhes = recurso.fields.filter(field => field.type !== "password" && field.type !== "checkbox")
              .map(field => {
                let value = item[field.name];
                if (field.name === "pais_id") value = relacoes.paises.find(pais => String(pais.id_pais) === String(value))?.nome ?? value;
                if (field.name === "estado_id") {
                  const estado = relacoes.estados.find(option => String(option.id_estado) === String(value));
                  value = estado ? `${String(estado.nome)} (${String(estado.uf)})` : value;
                }
                return `${field.label}: ${String(value ?? "—")}`;
              }).join(" · ");
            return <tr key={String(id)}><td>{tituloPrincipal(item)}</td><td>{detalhes || `ID ${String(id)}`}</td><td>{item.ativo === false ? "Inativo" : "Ativo"}</td><td><div className="cadastro-actions"><button className="btn outline" type="button" onClick={() => { setSelecionado(item); setErro(""); setSucesso(""); }}><Icon name="edit" /> Editar</button><button className="danger-button" type="button" disabled={excluindoId !== null} onClick={() => excluir(item)}><Icon name="trash" /> {String(excluindoId) === String(id) ? "Excluindo..." : "Excluir"}</button></div></td></tr>;
          })}
        </tbody>
      </table></div>
    </div>
  </>;
}

function Message({ children }: { children: string }) {
  return <tr><td className="table-message" colSpan={4}>{children}</td></tr>;
}
