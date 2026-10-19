import { useEffect, useState } from "react";
import type { Servidor } from "../types";
import { atualizarServidor, type DetalhesServidor, type NovoServidorDados } from "../services/servidores";
import type { DadosGeograficos } from "../services/localizacao";
import type { OpcoesServidorCompletas } from "../services/opcoesServidor";
import { FormularioDinamicoContainer } from "../components/formularios/FormularioDinamicoContainer";
import type { CampoFormularioConfig } from "../types/json-schema.types";
import { apiPost, apiPut } from "../services/api";
import Icon from "../components/Icon";
import Status from "../components/Status";
import RegistrosServidor from "../components/RegistrosServidor";

type Props = {
  servidor: Servidor;
  detalhes: DetalhesServidor;
  geografia: DadosGeograficos;
  opcoes: OpcoesServidorCompletas;
  onQuinquenios: () => void;
  onUpdated: () => void;
};

type Registro = Record<string, unknown>;

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

function Documento({ idServidor, recurso, titulo, item, campos, configuracoes, onSaved, formatar }: {
  idServidor: string | number;
  recurso: "certidao" | "cnh" | "ctps" | "identidade" | "tituloEleitor";
  titulo: string;
  item: unknown;
  campos: [string, string, boolean?][];
  configuracoes: Record<string, CampoFormularioConfig>;
  onSaved: (dados: Record<string, unknown>) => void;
  formatar?: (key: string, value: unknown) => unknown;
}) {
  const [editando, setEditando] = useState(false);
  const existente = Boolean(item && typeof item === "object");
  const registro = existente ? item as Registro : {};
  const valoresIniciais = Object.fromEntries(
    Object.entries(registro).map(([chave, value]) => [
      chave,
      configuracoes[chave]?.type === "date" ? dataInput(value) : value,
    ]),
  );

  async function salvar(dados: Record<string, unknown>) {
    const endpoint = `/api/servidores/${encodeURIComponent(String(idServidor))}/${recurso}`;
    if (existente) {
      await apiPut(endpoint, dados);
    } else {
      await apiPost(endpoint, dados);
    }
    onSaved(dados);
    setEditando(false);
  }

  return <section className="document-profile">
    <div className="section-heading">
      <h4>{titulo}</h4>
      {!editando && <button type="button" className="btn outline" onClick={() => { setEditando(true); }}>
        {existente ? "Editar" : "Cadastrar"}
      </button>}
    </div>
    {editando ? <>
      <FormularioDinamicoContainer
        key={`${recurso}-${existente ? "atualizar" : "adicionar"}`}
        dominio={recurso}
        idServidor={idServidor}
        operacao={existente ? "atualizar" : "adicionar"}
        valoresIniciais={valoresIniciais}
        campos={configuracoes}
        textoSalvar={existente ? "Salvar alterações" : "Cadastrar"}
        textoSalvando="Salvando..."
        onSubmit={salvar}
        onCancel={() => setEditando(false)}
      />
    </> : existente ? <div className="info-grid">
      {campos.map(([chave, nome, isData]) => <Info key={chave} label={nome} value={isData ? data(registro[chave]) : formatar ? formatar(chave, registro[chave]) : registro[chave]} />)}
    </div> : <p className="muted">Não cadastrado</p>}
  </section>;
}

export default function PerfilServidor({ servidor, detalhes, geografia, opcoes, onQuinquenios, onUpdated }: Props) {
  const [registro, setRegistro] = useState<Registro>(detalhes as Registro);
  const [editando, setEditando] = useState(false);
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

  async function salvarEdicao(dados: Record<string, unknown>) {
    setSalvo(false);
    const camposNumericosTexto = new Set(["cpf", "cpf_mae", "cpf_pai", "nis_pis", "cep", "cartao_sus"]);
    const payload = Object.fromEntries(
      Object.entries(dados).map(([nome, valor]) => [
        nome,
        camposNumericosTexto.has(nome) && valor !== undefined && valor !== null
          ? String(valor).replace(/\D/g, "")
          : valor,
      ]),
    ) as NovoServidorDados;
    await atualizarServidor(servidor.id, payload);
    setRegistro(current => ({ ...current, ...payload }));
    setEditando(false);
    setSalvo(true);
    onUpdated();
  }

  const opcoesPaises = geografia.paises.map(item => ({
    value: item.id_pais,
    label: item.gentilico ? `${item.gentilico} (${item.nome})` : item.nome,
  }));
  const opcoesMunicipios = geografia.municipios.map(item => {
    const uf = geografia.estados.find(estadoItem => estadoItem.id_estado === item.estado_id)?.uf;
    return { value: item.id_municipio, label: `${item.nome}${uf ? ` - ${uf}` : ""}` };
  });
  const opcoesCampos: Record<string, CampoFormularioConfig> = {
    ativo: { title: "Servidor ativo" },
    nome_completo: { title: "Nome completo" },
    nome_social: { title: "Nome social" },
    cpf: { title: "CPF", inputMode: "numeric", maxLength: 14 },
    nis_pis: { title: "NIS/PIS", inputMode: "numeric", maxLength: 11 },
    data_nascimento: { title: "Data de nascimento", type: "date" },
    nacionalidade_id: { title: "Nacionalidade", type: "select", options: opcoesPaises },
    pais_origem_id: { title: "País de origem", type: "select", options: opcoesPaises },
    municipio_nascimento_id: { title: "Município de nascimento", type: "select", options: opcoesMunicipios },
    sexo_id: { title: "Sexo", type: "select", options: opcoes.sexos.map(item => ({ value: item.id, label: item.descricao })) },
    genero_id: { title: "Gênero", type: "select", options: opcoes.generos.map(item => ({ value: item.id, label: item.descricao })) },
    racacor_id: { title: "Raça/cor", type: "select", options: opcoes.racasCor.map(item => ({ value: item.id, label: item.descricao })) },
    estado_civil_id: { title: "Estado civil", type: "select", options: opcoes.estadosCivis.map(item => ({ value: item.id, label: item.descricao })) },
    uniao_estavel: { title: "União estável" },
    nome_mae: { title: "Nome da mãe" },
    cpf_mae: { title: "CPF da mãe", inputMode: "numeric", maxLength: 14 },
    nome_pai: { title: "Nome do pai" },
    cpf_pai: { title: "CPF do pai", inputMode: "numeric", maxLength: 14 },
    ano_chegada_brasil: { title: "Ano de chegada ao Brasil" },
    cep: { title: "CEP", inputMode: "numeric", maxLength: 9 },
    logradouro: { title: "Logradouro" },
    numero: { title: "Número" },
    complemento: { title: "Complemento" },
    bairro: { title: "Bairro" },
    municipio_endereco_id: { title: "Município do endereço", type: "select", options: opcoesMunicipios },
    zona_endereco_id: { title: "Zona do endereço", type: "select", options: opcoes.zonasEndereco.map(item => ({ value: item.id, label: item.descricao })) },
    localizacao_diferenciada_id: { title: "Localização diferenciada", type: "select", options: opcoes.localizacoesDiferenciadas.map(item => ({ value: item.id, label: item.descricao })) },
    comunidade_indigena_id: { title: "Comunidade indígena", type: "select", options: opcoes.comunidadesIndigenas.map(item => ({ value: item.id, label: item.descricao })) },
    cartao_sus: { title: "Cartão SUS", inputMode: "numeric", maxLength: 15 },
    situacao_id: { title: "Situação", type: "select", options: opcoes.situacoes.map(item => ({ value: item.id, label: item.descricao })) },
    escolaridade_id: { title: "Escolaridade", type: "select", options: opcoes.escolaridades.map(item => ({ value: item.id, label: item.descricao })) },
    tipo_ensino_medio_cursado_id: { title: "Tipo de ensino médio", type: "select", options: opcoes.tiposEnsinoMedio.map(item => ({ value: item.id, label: item.descricao })) },
    observacao: { title: "Observação", type: "textarea" },
  };
  const valoresIniciais = {
    ...registro,
    data_nascimento: dataInput(registro.data_nascimento),
  };
  const camposDocumento: Record<"certidao" | "cnh" | "ctps" | "identidade" | "tituloEleitor", Record<string, CampoFormularioConfig>> = {
    certidao: {
      nova_certidao: { title: "Certidão nova" },
      matricula: { title: "Matrícula", inputMode: "numeric", maxLength: 32 },
      tipo_certidao: {
        title: "Tipo de certidão",
        options: [
          { value: "NASCIMENTO", label: "Nascimento" },
          { value: "CASAMENTO", label: "Casamento" },
        ],
      },
      termo: { title: "Termo", inputMode: "numeric", maxLength: 5, visibleWhen: { field: "nova_certidao", equals: false }, requiredWhen: { field: "nova_certidao", equals: false } },
      folha: { title: "Folha", inputMode: "numeric", maxLength: 5, visibleWhen: { field: "nova_certidao", equals: false }, requiredWhen: { field: "nova_certidao", equals: false } },
      livro: { title: "Livro", inputMode: "numeric", maxLength: 5, visibleWhen: { field: "nova_certidao", equals: false }, requiredWhen: { field: "nova_certidao", equals: false } },
      data_emissao: { title: "Data de emissão", type: "date" },
    },
    cnh: {
      numero: { title: "Número da CNH", inputMode: "numeric", maxLength: 11 },
      categoria: { title: "Categoria", maxLength: 15 },
      data_emissao: { title: "Data de emissão", type: "date" },
      data_validade: { title: "Data de validade", type: "date" },
    },
    ctps: {
      tipo_ctps: {
        title: "Tipo de CTPS",
        options: [
          { value: "ANTIGO", label: "Antiga" },
          { value: "NOVO", label: "Digital/nova" },
        ],
      },
      numero: { title: "Número", inputMode: "numeric", maxLength: 8, visibleWhen: { field: "tipo_ctps", equals: "ANTIGO" }, requiredWhen: { field: "tipo_ctps", equals: "ANTIGO" } },
      serie: { title: "Série", inputMode: "numeric", maxLength: 5, visibleWhen: { field: "tipo_ctps", equals: "ANTIGO" }, requiredWhen: { field: "tipo_ctps", equals: "ANTIGO" } },
      uf_ctps_id: {
        title: "UF da CTPS",
        type: "select",
        visibleWhen: { field: "tipo_ctps", equals: "ANTIGO" },
        requiredWhen: { field: "tipo_ctps", equals: "ANTIGO" },
        options: geografia.estados.map(item => ({
          value: item.id_estado,
          label: `${item.nome} (${item.uf})`,
        })),
      },
      data_emissao: { title: "Data de emissão", type: "date" },
    },
    identidade: {
      tipo_identidade: {
        title: "Tipo de identidade",
        options: [
          { value: "RG", label: "RG" },
          { value: "CIN", label: "CIN" },
        ],
      },
      numero: { title: "Número do RG", inputMode: "numeric", maxLength: 30, visibleWhen: { field: "tipo_identidade", equals: "RG" }, requiredWhen: { field: "tipo_identidade", equals: "RG" } },
      orgao_emissor: { title: "Órgão emissor", maxLength: 30 },
      rg_uf_id: {
        title: "UF da identidade",
        type: "select",
        options: geografia.estados.map(item => ({
          value: item.id_estado,
          label: `${item.nome} (${item.uf})`,
        })),
      },
      rg_data_emissao: { title: "Data de emissão", type: "date" },
    },
    tituloEleitor: {
      numero: { title: "Número", inputMode: "numeric", maxLength: 12 },
      zona: { title: "Zona eleitoral", inputMode: "numeric", maxLength: 4 },
      secao: { title: "Seção eleitoral", inputMode: "numeric", maxLength: 4 },
    },
  };
  function atualizarDocumento(recurso: keyof typeof camposDocumento, dados: Record<string, unknown>) {
    setRegistro(current => ({
      ...current,
      [recurso === "tituloEleitor" ? "titulo_eleitor" : recurso]: {
        ...((current[recurso === "tituloEleitor" ? "titulo_eleitor" : recurso] as Registro | undefined) ?? {}),
        ...dados,
      },
    }));
  }

  return <>
    <div className="page-head">
      <div><h1>Perfil do Servidor</h1><p>Servidores / {String(registro.nome_completo ?? servidor.nome)}</p></div>
      <button type="button" className="btn primary" onClick={() => { setEditando(value => !value); setSalvo(false); }}><Icon name="edit" /> {editando ? "Cancelar edição" : "Editar dados"}</button>
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
        {editando ? <>
          <FormularioDinamicoContainer
          key={`servidor-editar-${servidor.id}`}
          dominio="servidores"
          operacao="atualizar"
          valoresIniciais={valoresIniciais}
          campos={opcoesCampos}
          textoSalvar="Salvar alterações"
          textoSalvando="Salvando..."
          onSubmit={salvarEdicao}
          onCancel={() => setEditando(false)}
        />
        </> : <>
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
        <Documento idServidor={servidor.id} recurso="certidao" titulo="Certidão" item={registro.certidao} configuracoes={camposDocumento.certidao} onSaved={dados => { atualizarDocumento("certidao", dados); onUpdated(); }} campos={[["tipo_certidao", "Tipo"], ["nova_certidao", "Modelo novo"], ["matricula", "Matrícula"], ["termo", "Termo"], ["folha", "Folha"], ["livro", "Livro"], ["data_emissao", "Data de emissão", true]]} />
        <Documento idServidor={servidor.id} recurso="cnh" titulo="CNH" item={registro.cnh} configuracoes={camposDocumento.cnh} onSaved={dados => { atualizarDocumento("cnh", dados); onUpdated(); }} campos={[["numero", "Número"], ["categoria", "Categoria"], ["data_emissao", "Data de emissão", true], ["data_validade", "Validade", true]]} />
        <Documento idServidor={servidor.id} recurso="ctps" titulo="CTPS" item={registro.ctps} configuracoes={camposDocumento.ctps} onSaved={dados => { atualizarDocumento("ctps", dados); onUpdated(); }} campos={[["tipo_ctps", "Tipo"], ["numero", "Número"], ["serie", "Série"], ["uf_ctps_id", "UF"], ["data_emissao", "Data de emissão", true]]} formatar={(key, value) => key === "uf_ctps_id" ? estado(value) : value} />
        <Documento idServidor={servidor.id} recurso="identidade" titulo="Identidade" item={registro.identidade} configuracoes={camposDocumento.identidade} onSaved={dados => { atualizarDocumento("identidade", dados); onUpdated(); }} campos={[["tipo_identidade", "Tipo"], ["numero", "Número"], ["orgao_emissor", "Órgão emissor"], ["rg_uf_id", "UF"], ["rg_data_emissao", "Data de emissão", true]]} formatar={(key, value) => key === "rg_uf_id" ? estado(value) : value} />
        <Documento idServidor={servidor.id} recurso="tituloEleitor" titulo="Título de eleitor" item={registro.titulo_eleitor} configuracoes={camposDocumento.tituloEleitor} onSaved={dados => { atualizarDocumento("tituloEleitor", dados); onUpdated(); }} campos={[["numero", "Número"], ["zona", "Zona"], ["secao", "Seção"]]} />

        <h3 className="section-title section-spaced">Contatos e vínculos funcionais</h3>
        <RegistrosServidor idServidor={servidor.id} opcoes={opcoes} />
        </>}
      </div>
    </div>
  </>;
}

function initials(name: string) {
  return name.split(" ").filter(Boolean).map(part => part[0]).slice(0, 2).join("").toUpperCase();
}
