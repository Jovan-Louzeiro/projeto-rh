import { useEffect, useState, type FormEvent } from "react";
import type { Servidor } from "../types";
import { atualizarServidor, type DetalhesServidor, type NovoServidorDados } from "../services/servidores";
import type { DadosGeograficos } from "../services/localizacao";
import type { OpcoesServidorCompletas } from "../services/opcoesServidor";
import Icon from "../components/Icon";
import Status from "../components/Status";

type Props = {
  servidor: Servidor;
  detalhes: DetalhesServidor;
  geografia: DadosGeograficos;
  opcoes: OpcoesServidorCompletas;
  onQuinquenios: () => void;
};

type Registro = Record<string, unknown>;

function CampoSelect({ name, label, options, value, required = false }: {
  name: string; label: string; options: { id: string | number; descricao: string }[];
  value: unknown; required?: boolean;
}) {
  return <label>{label}<select name={name} defaultValue={value == null ? "" : String(value)} required={required}>
    <option value="">Selecione {label.toLowerCase()}</option>
    {options.map(option => <option key={String(option.id)} value={String(option.id)}>{option.descricao}</option>)}
  </select></label>;
}

const dataInput = (value: unknown) => value ? String(value).slice(0, 10) : "";

const valor = (item: unknown): string => {
  if (item === null || item === undefined || item === "") return "—";
  if (typeof item === "boolean") return item ? "Sim" : "Não";
  if (typeof item === "object") {
    const registro = item as Registro;
    return String(registro.descricao ?? registro.nome ?? registro.uf ?? "—");
  }
  return String(item);
};

const data = (item: unknown): string => {
  if (!item) return "—";
  const texto = String(item);
  const iso = texto.match(/^(\d{4})-(\d{2})-(\d{2})/);
  return iso ? `${iso[3]}/${iso[2]}/${iso[1]}` : texto;
};

function Info({ label, value }: { label: string; value: unknown }) {
  return <div className="info"><small>{label}</small><strong>{valor(value)}</strong></div>;
}

function Documento({ titulo, item, campos, formatar }: { titulo: string; item: unknown; campos: [string, string, boolean?][]; formatar?: (key: string, value: unknown) => unknown }) {
  if (!item || typeof item !== "object") {
    return <div className="info"><small>{titulo}</small><strong>Não cadastrado</strong></div>;
  }
  const registro = item as Registro;
  return <section className="document-profile">
    <h4>{titulo}</h4>
    <div className="info-grid">
      {campos.map(([chave, nome, isData]) => <Info key={chave} label={nome} value={isData ? data(registro[chave]) : formatar ? formatar(chave, registro[chave]) : registro[chave]} />)}
    </div>
  </section>;
}

export default function PerfilServidor({ servidor, detalhes, geografia, opcoes, onQuinquenios }: Props) {
  const [registro, setRegistro] = useState<Registro>(detalhes as Registro);
  const [editando, setEditando] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [erroEdicao, setErroEdicao] = useState("");
  const [salvo, setSalvo] = useState(false);
  useEffect(() => setRegistro(detalhes as Registro), [detalhes]);
  const pais = (id: unknown) => geografia.paises.find(item => item.id_pais === Number(id))?.nome ?? "—";
  const estado = (id: unknown) => {
    const item = geografia.estados.find(value => value.id_estado === Number(id));
    return item ? `${item.nome} (${item.uf})` : "—";
  };
  const municipio = (id: unknown) => {
    const item = geografia.municipios.find(value => value.id_municipio === Number(id));
    if (!item) return "—";
    const uf = geografia.estados.find(value => value.id_estado === item.estado_id)?.uf;
    return `${item.nome}${uf ? ` - ${uf}` : ""}`;
  };
  const dominio = (nome: keyof OpcoesServidorCompletas, id: unknown) =>
    opcoes[nome].find(item => String(item.id) === String(id))?.descricao ?? "—";
  const situacao = dominio("situacoes", registro.situacao_id);

  async function salvarEdicao(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const texto = (name: string) => String(form.get(name) ?? "").trim();
    const id = (name: string) => {
      const raw = texto(name);
      return raw ? Number(raw) : undefined;
    };
    const digitos = (name: string) => {
      const raw = texto(name).replace(/\D/g, "");
      return raw || undefined;
    };

    const dados: NovoServidorDados = {
      ativo: form.get("ativo") === "on",
      nome_completo: texto("nome_completo"),
      // O schema marca nome_social como opcional, mas exige pelo menos 1 caractere
      // quando enviado; valor vazio deve ser omitido do PATCH.
      nome_social: texto("nome_social") || undefined,
      cpf: digitos("cpf"),
      nis_pis: digitos("nis_pis"),
      data_nascimento: texto("data_nascimento"),
      nacionalidade_id: id("nacionalidade_id"),
      pais_origem_id: id("pais_origem_id"),
      ano_chegada_brasil: id("ano_chegada_brasil"),
      municipio_nascimento_id: id("municipio_nascimento_id"),
      cpf_mae: digitos("cpf_mae"),
      nome_mae: texto("nome_mae"),
      cpf_pai: digitos("cpf_pai"),
      nome_pai: texto("nome_pai"),
      estado_civil_id: id("estado_civil_id"),
      uniao_estavel: form.get("uniao_estavel") === "on",
      sexo_id: id("sexo_id"),
      genero_id: id("genero_id"),
      racacor_id: id("racacor_id"),
      comunidade_indigena_id: id("comunidade_indigena_id"),
      cep: digitos("cep"),
      logradouro: texto("logradouro"),
      numero: texto("numero"),
      complemento: texto("complemento"),
      bairro: texto("bairro"),
      municipio_endereco_id: id("municipio_endereco_id"),
      zona_endereco_id: id("zona_endereco_id"),
      localizacao_diferenciada_id: id("localizacao_diferenciada_id"),
      cartao_sus: digitos("cartao_sus"),
      situacao_id: id("situacao_id"),
      escolaridade_id: id("escolaridade_id"),
      tipo_ensino_medio_cursado_id: id("tipo_ensino_medio_cursado_id"),
      observacao: texto("observacao"),
    };

    setSalvando(true);
    setErroEdicao("");
    setSalvo(false);
    try {
      // O JSON não deve conter campos opcionais vazios/undefined que o Zod
      // validaria como valores informados.
      const payload = Object.fromEntries(
        Object.entries(dados).filter(([, value]) => value !== undefined),
      ) as NovoServidorDados;
      await atualizarServidor(servidor.id, payload);
      const enviados = payload;
      setRegistro(current => ({ ...current, ...enviados }));
      setEditando(false);
      setSalvo(true);
    } catch (error) {
      setErroEdicao(error instanceof Error ? error.message : "Não foi possível salvar as alterações.");
    } finally {
      setSalvando(false);
    }
  }

  const opcoesPaises = geografia.paises.map(item => ({ id: item.id_pais, descricao: item.gentilico ? `${item.gentilico} (${item.nome})` : item.nome }));
  const opcoesMunicipios = geografia.municipios.map(item => {
    const uf = geografia.estados.find(estado => estado.id_estado === item.estado_id)?.uf;
    return { id: item.id_municipio, descricao: `${item.nome}${uf ? ` - ${uf}` : ""}` };
  });
  const opcoesEstados = geografia.estados.map(item => ({ id: item.id_estado, descricao: `${item.nome} (${item.uf})` }));

  return <>
    <div className="page-head">
      <div><h1>Perfil do Servidor</h1><p>Servidores / {String(registro.nome_completo ?? servidor.nome)}</p></div>
      <button type="button" className="btn primary" onClick={() => { setEditando(value => !value); setErroEdicao(""); setSalvo(false); }}><Icon name="edit" /> {editando ? "Cancelar edição" : "Editar dados"}</button>
    </div>

    <div className="profile">
      <aside className="card profile-side">
        <div className="profile-photo">{initials(servidor.nome)}</div>
        <div className="profile-name">{String(registro.nome_completo ?? servidor.nome)}</div>
        <div className="profile-role">{dominio("cargos", registro.cargo_id)}</div>
        <Status>{situacao === "—" ? servidor.status : situacao}</Status>
        <hr />
        <p className="small">CPF: {String(registro.cpf ?? servidor.cpf ?? "—")}</p>
        <p className="small">E-mail: {servidor.email || "—"}</p>
      </aside>

      <div className="card">
        <div className="tabs">
          <button type="button" className="tab active">Dados do servidor</button>
          <button type="button" className="tab" onClick={onQuinquenios}>Quinquênios</button>
        </div>

        {salvo && <p className="form-success" role="status">Dados do servidor atualizados.</p>}
        {editando ? <form onSubmit={salvarEdicao}>
          <h3 className="section-title">Dados pessoais</h3>
          <div className="form-grid">
            <label>Nome completo<input name="nome_completo" defaultValue={valor(registro.nome_completo) === "—" ? "" : String(registro.nome_completo)} required /></label>
            <label>Nome social<input name="nome_social" defaultValue={String(registro.nome_social ?? "")} /></label>
            <label>CPF<input name="cpf" defaultValue={String(registro.cpf ?? "")} inputMode="numeric" maxLength={14} required /></label>
            <label>NIS/PIS<input name="nis_pis" defaultValue={String(registro.nis_pis ?? "")} inputMode="numeric" /></label>
            <label>Data de nascimento<input name="data_nascimento" type="date" defaultValue={dataInput(registro.data_nascimento)} required /></label>
            <CampoSelect name="nacionalidade_id" label="Nacionalidade" options={opcoesPaises} value={registro.nacionalidade_id} required />
            <CampoSelect name="pais_origem_id" label="País de origem" options={opcoesPaises} value={registro.pais_origem_id} />
            <label>Ano de chegada ao Brasil<input name="ano_chegada_brasil" type="number" defaultValue={String(registro.ano_chegada_brasil ?? "")} /></label>
            <CampoSelect name="municipio_nascimento_id" label="Município de nascimento" options={opcoesMunicipios} value={registro.municipio_nascimento_id} />
            <CampoSelect name="sexo_id" label="Sexo" options={opcoes.sexos} value={registro.sexo_id} required />
            <CampoSelect name="genero_id" label="Gênero" options={opcoes.generos} value={registro.genero_id} />
            <CampoSelect name="racacor_id" label="Raça/cor" options={opcoes.racasCor} value={registro.racacor_id} required />
            <CampoSelect name="estado_civil_id" label="Estado civil" options={opcoes.estadosCivis} value={registro.estado_civil_id} />
            <label className="document-toggle"><input name="uniao_estavel" type="checkbox" defaultChecked={Boolean(registro.uniao_estavel)} /> União estável</label>
          </div>

          <h3 className="section-title section-spaced">Filiação</h3>
          <div className="form-grid">
            <label>Nome da mãe<input name="nome_mae" defaultValue={String(registro.nome_mae ?? "")} required /></label>
            <label>CPF da mãe<input name="cpf_mae" defaultValue={String(registro.cpf_mae ?? "")} inputMode="numeric" /></label>
            <label>Nome do pai<input name="nome_pai" defaultValue={String(registro.nome_pai ?? "")} required /></label>
            <label>CPF do pai<input name="cpf_pai" defaultValue={String(registro.cpf_pai ?? "")} inputMode="numeric" /></label>
          </div>

          <h3 className="section-title section-spaced">Endereço</h3>
          <div className="form-grid">
            <label>CEP<input name="cep" defaultValue={String(registro.cep ?? "")} inputMode="numeric" maxLength={9} required /></label>
            <label>Logradouro<input name="logradouro" defaultValue={String(registro.logradouro ?? "")} required /></label>
            <label>Número<input name="numero" defaultValue={String(registro.numero ?? "")} /></label>
            <label>Complemento<input name="complemento" defaultValue={String(registro.complemento ?? "")} /></label>
            <label>Bairro<input name="bairro" defaultValue={String(registro.bairro ?? "")} required /></label>
            <CampoSelect name="municipio_endereco_id" label="Município do endereço" options={opcoesMunicipios} value={registro.municipio_endereco_id} required />
            <CampoSelect name="zona_endereco_id" label="Zona do endereço" options={opcoes.zonasEndereco} value={registro.zona_endereco_id} required />
            <CampoSelect name="localizacao_diferenciada_id" label="Localização diferenciada" options={opcoes.localizacoesDiferenciadas} value={registro.localizacao_diferenciada_id} />
            <CampoSelect name="comunidade_indigena_id" label="Comunidade indígena" options={opcoes.comunidadesIndigenas} value={registro.comunidade_indigena_id} />
            <label>Cartão SUS<input name="cartao_sus" defaultValue={String(registro.cartao_sus ?? "")} inputMode="numeric" /></label>
          </div>

          <h3 className="section-title section-spaced">Dados funcionais e educação</h3>
          <div className="form-grid">
            <CampoSelect name="situacao_id" label="Situação" options={opcoes.situacoes} value={registro.situacao_id} required />
            <CampoSelect name="escolaridade_id" label="Escolaridade" options={opcoes.escolaridades} value={registro.escolaridade_id} />
            <CampoSelect name="tipo_ensino_medio_cursado_id" label="Tipo de ensino médio" options={opcoes.tiposEnsinoMedio} value={registro.tipo_ensino_medio_cursado_id} />
            <label className="document-toggle"><input name="ativo" type="checkbox" defaultChecked={registro.ativo !== false} /> Servidor ativo</label>
            <label className="full-col">Observação<textarea name="observacao" defaultValue={String(registro.observacao ?? "")} rows={3} /></label>
          </div>
          {erroEdicao && <p className="form-error" role="alert" style={{ whiteSpace: "pre-line" }}>{erroEdicao}</p>}
          <div className="form-actions">
            <button type="button" className="btn outline" onClick={() => setEditando(false)} disabled={salvando}>Cancelar</button>
            <button type="submit" className="btn primary" disabled={salvando}>{salvando ? "Salvando..." : "Salvar alterações"}</button>
          </div>
        </form> : <>
        <h3 className="section-title">Dados pessoais</h3>
        <div className="info-grid">
          <Info label="Nome completo" value={registro.nome_completo} />
          <Info label="Nome social" value={registro.nome_social} />
          <Info label="CPF" value={registro.cpf} />
          <Info label="NIS/PIS" value={registro.nis_pis} />
          <Info label="Data de nascimento" value={data(registro.data_nascimento)} />
          <Info label="Sexo" value={dominio("sexos", registro.sexo_id)} />
          <Info label="Gênero" value={dominio("generos", registro.genero_id)} />
          <Info label="Raça/cor" value={dominio("racasCor", registro.racacor_id)} />
          <Info label="Estado civil" value={dominio("estadosCivis", registro.estado_civil_id)} />
          <Info label="União estável" value={registro.uniao_estavel} />
          <Info label="Nacionalidade" value={pais(registro.nacionalidade_id)} />
          <Info label="País de origem" value={pais(registro.pais_origem_id)} />
          <Info label="Município de nascimento" value={municipio(registro.municipio_nascimento_id)} />
          <Info label="Nome da mãe" value={registro.nome_mae} />
          <Info label="Nome do pai" value={registro.nome_pai} />
        </div>

        <h3 className="section-title section-spaced">Endereço</h3>
        <div className="info-grid">
          <Info label="CEP" value={registro.cep} />
          <Info label="Logradouro" value={registro.logradouro} />
          <Info label="Número" value={registro.numero} />
          <Info label="Complemento" value={registro.complemento} />
          <Info label="Bairro" value={registro.bairro} />
          <Info label="Município" value={municipio(registro.municipio_endereco_id)} />
        </div>

        <h3 className="section-title section-spaced">Dados funcionais</h3>
        <div className="info-grid">
          <Info label="Situação" value={situacao} />
          <Info label="Departamento" value={dominio("departamentos", registro.departamento_id)} />
          <Info label="Cargo" value={dominio("cargos", registro.cargo_id)} />
          <Info label="Tipo de vínculo" value={dominio("tiposVinculo", registro.tipo_vinculo_id)} />
          <Info label="Escolaridade" value={dominio("escolaridades", registro.escolaridade_id)} />
          <Info label="Tipo de ensino médio" value={dominio("tiposEnsinoMedio", registro.tipo_ensino_medio_cursado_id)} />
          <Info label="Observação" value={registro.observacao} />
        </div>

        <h3 className="section-title section-spaced">Documentos</h3>
        <Documento titulo="Certidão" item={registro.certidao} campos={[["tipo_certidao", "Tipo"], ["nova_certidao", "Modelo novo"], ["matricula", "Matrícula"], ["termo", "Termo"], ["folha", "Folha"], ["livro", "Livro"], ["data_emissao", "Data de emissão", true]]} />
        <Documento titulo="CNH" item={registro.cnh} campos={[["numero", "Número"], ["categoria", "Categoria"], ["data_emissao", "Data de emissão", true], ["data_validade", "Validade", true]]} />
        <Documento titulo="CTPS" item={registro.ctps} campos={[["tipo_ctps", "Tipo"], ["numero", "Número"], ["serie", "Série"], ["uf_ctps_id", "UF"], ["data_emissao", "Data de emissão", true]]} formatar={(key, value) => key === "uf_ctps_id" ? estado(value) : value} />
        <Documento titulo="Identidade" item={registro.identidade} campos={[["tipo_identidade", "Tipo"], ["numero", "Número"], ["orgao_emissor", "Órgão emissor"], ["rg_uf_id", "UF"], ["rg_data_emissao", "Data de emissão", true]]} formatar={(key, value) => key === "rg_uf_id" ? estado(value) : value} />
        <Documento titulo="Título de eleitor" item={registro.titulo_eleitor} campos={[["numero", "Número"], ["zona", "Zona"], ["secao", "Seção"]]} />
        </>}
      </div>
    </div>
  </>;
}

function initials(name: string) {
  return name.split(" ").filter(Boolean).map(part => part[0]).slice(0, 2).join("").toUpperCase();
}
