import {
  useRef,
  useEffect,
  useState,
} from "react";

import {
  cadastrarServidor,
  type NovoServidorDados,
} from "../services/servidores";

import {
  listarCargos,
  listarComunidadesIndigenas,
  listarDepartamentos,
  listarEscolaridades,
  listarEstadosCivis,
  listarFuncoes,
  listarGeneros,
  listarLocalizacoesDiferenciadas,
  listarRacasCor,
  listarSituacoes,
  listarSexos,
  listarTiposEnsinoMedio,
  listarTiposVinculo,
  listarZonasEndereco,
  type OpcaoServidor,
} from "../services/opcoesServidor";
import type { TipoContato } from "../services/registrosServidor";

import Icon from "../components/Icon";
import { carregarDadosGeograficos, type DadosGeograficos } from "../services/localizacao";
import { FormularioDinamicoContainer } from "../components/formularios/FormularioDinamicoContainer";
import { criarSchemaLocal } from "../components/formularios/schemaLocal";
import type { CampoFormularioConfig } from "../types/json-schema.types";

type Props = {
  onBack: () => void;
};

type Opcoes = {
  sexos: OpcaoServidor[];
  generos: OpcaoServidor[];
  racasCor: OpcaoServidor[];
  estadosCivis: OpcaoServidor[];
  cargos: OpcaoServidor[];
  funcoes: OpcaoServidor[];
  departamentos: OpcaoServidor[];
  tiposVinculo: OpcaoServidor[];
  escolaridades: OpcaoServidor[];
  tiposEnsinoMedio: OpcaoServidor[];
  zonasEndereco: OpcaoServidor[];
  localizacoesDiferenciadas: OpcaoServidor[];
  comunidadesIndigenas: OpcaoServidor[];
  situacoes: OpcaoServidor[];
};

type ContatoFormulario = {
  id: number;
  tipo: TipoContato;
  valor: string;
  principal: boolean;
};

type TipoDocumento = "certidao" | "cnh" | "ctps" | "identidade" | "tituloEleitor";
type DocumentoFormulario = { id: number; tipo: TipoDocumento };
type HistoricoFormulario = {
  id: number;
  cargo_id: string;
  funcao_id: string;
  departamento_id: string;
  situacao_id: string;
  data_inicio: string;
  data_fim: string;
};
type MatriculaFormulario = {
  id: number;
  numero: string;
  admissao: string;
  ativo: boolean;
  tipo_vinculo_id: string;
  historicos: HistoricoFormulario[];
};

const tiposDocumento: { tipo: TipoDocumento; titulo: string }[] = [
  { tipo: "certidao", titulo: "Certidão" },
  { tipo: "cnh", titulo: "CNH" },
  { tipo: "ctps", titulo: "CTPS" },
  { tipo: "identidade", titulo: "Identidade" },
  { tipo: "tituloEleitor", titulo: "Título de eleitor" },
];

const opcoesVazias: Opcoes = {
  sexos: [],
  generos: [],
  racasCor: [],
  estadosCivis: [],
  cargos: [],
  funcoes: [],
  departamentos: [],
  tiposVinculo: [],
  escolaridades: [],
  tiposEnsinoMedio: [],
  zonasEndereco: [],
  localizacoesDiferenciadas: [],
  comunidadesIndigenas: [],
  situacoes: [],
};
const dadosGeograficosVazios: DadosGeograficos = { paises: [], estados: [], municipios: [] };

function formatarDataParaApi(data: string): string {
  // Input type="date" já fornece YYYY-MM-DD, formato validado pelo backend.
  return data;
}

export default function NovoServidor({
  onBack,
}: Props) {
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [opcoes, setOpcoes] =
    useState<Opcoes>(opcoesVazias);
  const [geografia, setGeografia] = useState(dadosGeograficosVazios);
  const [documentos, setDocumentos] = useState<DocumentoFormulario[]>([]);
  const [certidaoNova, setCertidaoNova] = useState(true);
  const [ctpsAntiga, setCtpsAntiga] = useState(true);
  const [identidadeTipo, setIdentidadeTipo] = useState<"RG" | "CIN">("RG");
  const [contatos, setContatos] = useState<ContatoFormulario[]>([]);
  const [matriculas, setMatriculas] = useState<MatriculaFormulario[]>([]);
  const proximoContatoId = useRef(0);
  const proximoDocumentoId = useRef(0);
  const proximoMatriculaId = useRef(0);
  const proximoHistoricoId = useRef(0);
  const documentosIncluidos = {
    certidao: documentos.some(documento => documento.tipo === "certidao"),
    cnh: documentos.some(documento => documento.tipo === "cnh"),
    ctps: documentos.some(documento => documento.tipo === "ctps"),
    identidade: documentos.some(documento => documento.tipo === "identidade"),
    tituloEleitor: documentos.some(documento => documento.tipo === "tituloEleitor"),
  };

  useEffect(() => {
    const controller = new AbortController();

    async function carregarOpcoes() {
      setLoading(true);
      setError("");

      try {
        const [
          sexos,
          generos,
          racasCor,
          estadosCivis,
          cargos,
          funcoes,
          departamentos,
          tiposVinculo,
          escolaridades,
          tiposEnsinoMedio,
          zonasEndereco,
          localizacoesDiferenciadas,
          comunidadesIndigenas,
          situacoes,
          geografiaCarregada,
        ] = await Promise.all([
          listarSexos(controller.signal),
          listarGeneros(controller.signal),
          listarRacasCor(controller.signal),
          listarEstadosCivis(controller.signal),
          listarCargos(controller.signal),
          listarFuncoes(controller.signal),
          listarDepartamentos(controller.signal),
          listarTiposVinculo(controller.signal),
          listarEscolaridades(controller.signal),
          listarTiposEnsinoMedio(controller.signal),
          listarZonasEndereco(controller.signal),
          listarLocalizacoesDiferenciadas(
            controller.signal
          ),
          listarComunidadesIndigenas(
            controller.signal
          ),
          listarSituacoes(controller.signal),
          carregarDadosGeograficos(controller.signal),
        ]);

        setOpcoes({
          sexos,
          generos,
          racasCor,
          estadosCivis,
          cargos,
          funcoes,
          departamentos,
          tiposVinculo,
          escolaridades,
          tiposEnsinoMedio,
          zonasEndereco,
          localizacoesDiferenciadas,
          comunidadesIndigenas,
          situacoes,
        });
        setGeografia(geografiaCarregada);
      } catch (erro: unknown) {
        if (
          erro instanceof DOMException &&
          erro.name === "AbortError"
        ) {
          return;
        }

        setError(
          erro instanceof Error
            ? erro.message
            : "Não foi possível carregar as opções da API."
        );
      } finally {
        setLoading(false);
      }
    }

    carregarOpcoes();

    return () => controller.abort();
  }, []);

  async function submit(_dados: Record<string, unknown>, form: FormData) {
    setSaving(true);
    setError("");

    const valorCampo = (name: string) => _dados[name] ?? form.get(name) ?? "";

    /**
     * Texto:
     * vazio = null
     */
    const texto = (
      name: string
    ): string | undefined => {
      const value = String(valorCampo(name)).trim();

      return value || undefined;
    };

    /**
     * ID:
     * vazio = null
     * preenchido = número
     */
    const id = (
      name: string
    ): number | undefined => {
      const value = String(valorCampo(name)).trim();

      if (!value) {
        return undefined;
      }

      const convertido = Number(value);

      if (
        !Number.isInteger(convertido) ||
        convertido <= 0
      ) {
        return undefined;
      }

      return convertido;
    };

    /**
     * Documento:
     * remove máscara e caracteres não numéricos.
     */
    const documento = (
      name: string
    ): string | undefined => {
      const value = String(valorCampo(name)).trim();

      const somenteNumeros =
        value.replace(/\D/g, "");

      return somenteNumeros || undefined;
    };

    const campo = (name: string) => texto(name);
    const numeroDocumento = (name: string) => documento(name);

    const dataNascimento = String(valorCampo("data_nascimento")).trim();

    /**
     * Payload exatamente no formato
     * esperado pelo serviço/backend.
     *
     * Os relacionamentos são enviados como IDs.
     */
    const dados: NovoServidorDados = {
      ativo: valorCampo("ativo") === true || valorCampo("ativo") === "on",

      nome_completo: String(
        form.get("nome_completo") ?? ""
      ).trim(),

      nome_social: texto("nome_social"),

      cpf: documento("cpf") ?? "",

      nis_pis: documento("nis_pis"),

      data_nascimento:
        formatarDataParaApi(
          dataNascimento
        ),

      nacionalidade_id:
        id("nacionalidade_id"),

      pais_origem_id:
        id("pais_origem_id"),

      ano_chegada_brasil:
        id("ano_chegada_brasil"),

      municipio_nascimento_id:
        id("municipio_nascimento_id"),

      cpf_mae:
        documento("cpf_mae"),

      nome_mae:
        texto("nome_mae"),

      cpf_pai:
        documento("cpf_pai"),

      nome_pai:
        texto("nome_pai"),

      estado_civil_id:
        id("estado_civil_id"),

      uniao_estavel:
        valorCampo("uniao_estavel") === true || valorCampo("uniao_estavel") === "on",

      sexo_id:
        id("sexo_id"),

      genero_id:
        id("genero_id"),

      racacor_id:
        id("racacor_id"),

      comunidade_indigena_id:
        id("comunidade_indigena_id"),

      cep:
        documento("cep"),

      logradouro:
        texto("logradouro"),

      numero:
        texto("numero"),

      complemento:
        texto("complemento"),

      bairro:
        texto("bairro"),

      municipio_endereco_id:
        id("municipio_endereco_id"),

      zona_endereco_id:
        id("zona_endereco_id"),

      localizacao_diferenciada_id:
        id("localizacao_diferenciada_id"),

      cartao_sus:
        documento("cartao_sus"),

      situacao_id:
        id("situacao_id"),

      escolaridade_id:
        id("escolaridade_id"),

      tipo_ensino_medio_cursado_id:
        id(
          "tipo_ensino_medio_cursado_id"
        ),

      observacao:
        texto("observacao"),

      certidao: documentosIncluidos.certidao
        ? {
            nova_certidao: valorCampo("certidao_nova") === "true",
            matricula: numeroDocumento("certidao_matricula"),
            tipo_certidao: campo("certidao_tipo"),
            data_emissao: campo("certidao_data_emissao"),
            ...(valorCampo("certidao_nova") === "true"
              ? {}
              : {
                  termo: numeroDocumento("certidao_termo"),
                  folha: numeroDocumento("certidao_folha"),
                  livro: numeroDocumento("certidao_livro"),
                }),
          }
        : undefined,

      contatos: contatos.map(({ tipo, valor, principal }) => ({
        tipo_contato: tipo,
        contato: tipo === "EMAIL" ? valor.trim() : valor.replace(/\D/g, ""),
        principal,
        ativo: true,
      })),
      matriculas: matriculas.map(({ id: _id, historicos, ...matricula }) => ({
        ...matricula,
        tipo_vinculo_id: Number(matricula.tipo_vinculo_id),
        historicos_funcionais: historicos.map(({ id: _historicoId, ...historico }) => ({
          cargo_id: Number(historico.cargo_id),
          funcao_id: Number(historico.funcao_id),
          departamento_id: Number(historico.departamento_id),
          situacao_id: Number(historico.situacao_id),
          data_inicio: historico.data_inicio,
          ...(historico.data_fim ? { data_fim: historico.data_fim } : {}),
        })),
      })),

      cnh: documentosIncluidos.cnh
        ? {
            numero: numeroDocumento("cnh_numero"),
            categoria: campo("cnh_categoria"),
            data_emissao: campo("cnh_data_emissao"),
            data_validade: campo("cnh_data_validade"),
          }
        : undefined,

      ctps: documentosIncluidos.ctps
        ? {
            tipo_ctps: campo("ctps_tipo"),
            ...(valorCampo("ctps_tipo") === "ANTIGO"
              ? {
                  numero: numeroDocumento("ctps_numero"),
                  serie: numeroDocumento("ctps_serie"),
                  uf_ctps_id: id("ctps_uf_id"),
                }
              : {}),
            data_emissao: campo("ctps_data_emissao"),
          }
        : undefined,

      identidade: documentosIncluidos.identidade
        ? {
            tipo_identidade: identidadeTipo,
            ...(identidadeTipo === "RG"
              ? { numero: numeroDocumento("identidade_numero") }
              : {}),
            orgao_emissor: campo("identidade_orgao"),
            rg_uf_id: id("identidade_uf_id"),
            rg_data_emissao: campo("identidade_data_emissao"),
          }
        : undefined,

      titulo_eleitor: documentosIncluidos.tituloEleitor
        ? {
            numero: numeroDocumento("titulo_numero"),
            zona: numeroDocumento("titulo_zona"),
            secao: numeroDocumento("titulo_secao"),
          }
        : undefined,
    };

    /*
     * ================================
     * VALIDAÇÕES
     * ================================
     */

    if (!dados.nome_completo) {
      setError(
        "Informe o nome completo do servidor."
      );
      setSaving(false);
      return;
    }

    const contatoInvalido = contatos.find(({ tipo, valor }) => {
      const limpo = valor.trim();
      return tipo === "EMAIL"
        ? !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(limpo)
        : limpo.replace(/\D/g, "").length !== (tipo === "TELEFONE_MOVEL" ? 11 : 10);
    });
    if (contatoInvalido) {
      setError(
        contatoInvalido.tipo === "EMAIL"
          ? "Informe um endereço de e-mail válido para cada contato."
          : `Informe um telefone com DDD e ${contatoInvalido.tipo === "TELEFONE_MOVEL" ? "11" : "10"} dígitos.`,
      );
      setSaving(false);
      return;
    }

    if (!dados.cpf) {
      setError(
        "Informe o CPF do servidor."
      );
      setSaving(false);
      return;
    }

    if (dados.cpf.length !== 11) {
      setError(
        "Informe um CPF válido com 11 dígitos."
      );
      setSaving(false);
      return;
    }

    if (!dados.data_nascimento) {
      setError(
        "Informe a data de nascimento."
      );
      setSaving(false);
      return;
    }

    if (!dados.nacionalidade_id) {
      setError(
        "Informe a nacionalidade."
      );
      setSaving(false);
      return;
    }

    if (!dados.nome_mae) {
      setError(
        "Informe o nome da mãe."
      );
      setSaving(false);
      return;
    }

    if (!dados.nome_pai) {
      setError(
        "Informe o nome do pai."
      );
      setSaving(false);
      return;
    }

    if (!dados.sexo_id) {
      setError(
        "Selecione o sexo."
      );
      setSaving(false);
      return;
    }

    if (!dados.racacor_id) {
      setError(
        "Selecione a raça/cor."
      );
      setSaving(false);
      return;
    }

    if (!dados.cep) {
      setError(
        "Informe o CEP."
      );
      setSaving(false);
      return;
    }

    if (dados.cep.length !== 8) {
      setError(
        "Informe um CEP válido com 8 dígitos."
      );
      setSaving(false);
      return;
    }

    if (!dados.logradouro) {
      setError(
        "Informe o logradouro."
      );
      setSaving(false);
      return;
    }

    if (!dados.bairro) {
      setError(
        "Informe o bairro."
      );
      setSaving(false);
      return;
    }

    if (!dados.municipio_endereco_id) {
      setError(
        "Selecione o município do endereço."
      );
      setSaving(false);
      return;
    }

    if (!dados.zona_endereco_id) {
      setError(
        "Selecione a zona do endereço."
      );
      setSaving(false);
      return;
    }

    if (!dados.situacao_id) {
      setError(
        "Selecione a situação."
      );
      setSaving(false);
      return;
    }

    /*
     * ================================
     * ENVIO PARA API
     * ================================
     */

    try {
      await cadastrarServidor(dados);

      onBack();
    } catch (erro: unknown) {
      console.error(
        "Erro ao cadastrar servidor:",
        erro
      );

      setError(
        erro instanceof Error
          ? erro.message
          : "Não foi possível cadastrar o servidor."
      );
    } finally {
      setSaving(false);
    }
  }

  function SelectApi({
    name,
    label,
    options,
    required = false,
  }: {
    name: string;
    label: string;
    options: OpcaoServidor[];
    required?: boolean;
  }) {
    return (
      <label>
        {label}

        <select
          name={name}
          required={required}
          defaultValue=""
          disabled={loading}
        >
          <option value="">
            --------
          </option>

          {options.map((opcao) => (
            <option
              key={String(opcao.id)}
              value={String(opcao.id)}
            >
              {opcao.descricao}
            </option>
          ))}
        </select>
      </label>
    );
  }

  const opcoesPaises: OpcaoServidor[] = geografia.paises.map(pais => ({
    id: pais.id_pais,
    descricao: pais.gentilico ? `${pais.gentilico} (${pais.nome})` : pais.nome,
  }));
  const opcoesMunicipios: OpcaoServidor[] = geografia.municipios.map(municipio => {
    const estado = geografia.estados.find(item => item.id_estado === municipio.estado_id);
    return { id: municipio.id_municipio, descricao: `${municipio.nome}${estado ? ` - ${estado.uf}` : ""}` };
  });
  const opcoesEstados: OpcaoServidor[] = geografia.estados.map(estado => ({
    id: estado.id_estado,
    descricao: `${estado.nome} (${estado.uf})`,
  }));
  const normalizarOpcao = (valor: string) => valor.normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
  const paisBrasileiro = geografia.paises.find(pais =>
    normalizarOpcao(pais.nome) === "brasil"
    || normalizarOpcao(pais.gentilico).includes("brasileir"),
  );
  const idPaisBrasileiro = paisBrasileiro?.id_pais;
  const opcaoIndigena = opcoes.racasCor.find(opcao =>
    normalizarOpcao(opcao.descricao).includes("indigena"),
  );
  const opcaoCasado = opcoes.estadosCivis.find(opcao =>
    normalizarOpcao(opcao.descricao).includes("casad"),
  );
  const racasNaoIndigenas = opcoes.racasCor.filter(opcao => opcao.id !== opcaoIndigena?.id);
  const configurarOpcoes = (itens: OpcaoServidor[]) => ({
    type: "select" as const,
    disabled: loading,
    options: itens.map(item => ({ value: item.id, label: item.descricao })),
  });
  const campos: Record<string, CampoFormularioConfig> = {
    ativo: { title: "Servidor ativo", defaultValue: true, estilo: "toggle" },
    nome_completo: { title: "Nome completo", placeholder: "Nome completo" },
    nome_social: { title: "Nome social", placeholder: "Nome social" },
    cpf: { title: "CPF", placeholder: "000.000.000-00", inputMode: "numeric", maxLength: 14, formato: "cpf" },
    nis_pis: { title: "NIS/PIS", placeholder: "NIS/PIS", inputMode: "numeric", maxLength: 11 },
    data_nascimento: { title: "Data de nascimento", type: "date" },
    nacionalidade_id: {
      title: "Nacionalidade",
      ...configurarOpcoes(opcoesPaises),
      setValueWhen: idPaisBrasileiro === undefined ? [] : [{
          equals: idPaisBrasileiro,
          targetField: "pais_origem_id",
          value: idPaisBrasileiro,
        }, {
          equals: idPaisBrasileiro,
          targetField: "ano_chegada_brasil",
          value: "",
        }],
    },
    pais_origem_id: {
      title: "País de origem",
      ...configurarOpcoes(opcoesPaises),
      disabledWhen: idPaisBrasileiro === undefined ? [] : [
        { field: "nacionalidade_id", equals: idPaisBrasileiro },
      ],
    },
    ano_chegada_brasil: {
      title: "Ano de chegada ao Brasil",
      type: "number",
      placeholder: "AAAA",
      minimum: 1500,
      maximum: 9999,
      tamanho: "compacto",
      disabledWhen: idPaisBrasileiro === undefined ? [] : [
        { field: "nacionalidade_id", equals: idPaisBrasileiro },
      ],
    },
    municipio_nascimento_id: { title: "Município de nascimento", ...configurarOpcoes(opcoesMunicipios) },
    cpf_mae: { title: "CPF da mãe", placeholder: "000.000.000-00", inputMode: "numeric", maxLength: 14, formato: "cpf" },
    nome_mae: { title: "Nome da mãe", placeholder: "Nome da mãe" },
    cpf_pai: { title: "CPF do pai", placeholder: "000.000.000-00", inputMode: "numeric", maxLength: 14, formato: "cpf" },
    nome_pai: { title: "Nome do pai", placeholder: "Nome do pai" },
    estado_civil_id: {
      title: "Estado civil",
      ...configurarOpcoes(opcoes.estadosCivis),
      setValueWhen: [
        { equals: "", targetField: "uniao_estavel", value: false },
        ...(opcaoCasado ? [{
          equals: opcaoCasado.id,
          targetField: "uniao_estavel",
          value: false,
        }] : []),
      ],
    },
    uniao_estavel: {
      title: "União estável",
      type: "boolean",
      disabledWhen: [
        { field: "estado_civil_id", equals: "" },
        ...(opcaoCasado ? [{ field: "estado_civil_id", equals: opcaoCasado.id }] : []),
      ],
    },
    sexo_id: { title: "Sexo", ...configurarOpcoes(opcoes.sexos) },
    genero_id: { title: "Gênero", ...configurarOpcoes(opcoes.generos) },
    racacor_id: {
      title: "Raça/cor",
      ...configurarOpcoes(opcoes.racasCor),
      setValueWhen: racasNaoIndigenas.map(opcao => ({
        equals: opcao.id,
        targetField: "comunidade_indigena_id",
        value: "",
      })),
    },
    comunidade_indigena_id: {
      title: "Povo indígena",
      ...configurarOpcoes(opcoes.comunidadesIndigenas),
      disabledWhen: opcaoIndigena
        ? [
            { field: "racacor_id", equals: "" },
            ...racasNaoIndigenas.map(opcao => ({ field: "racacor_id", equals: opcao.id })),
          ]
        : [
            { field: "racacor_id", equals: "" },
            ...opcoes.racasCor.map(opcao => ({ field: "racacor_id", equals: opcao.id })),
          ],
    },
    cep: { title: "CEP", placeholder: "CEP", inputMode: "numeric", maxLength: 9 },
    logradouro: { title: "Logradouro", placeholder: "Rua, avenida..." },
    numero: { title: "Número", placeholder: "Número" },
    complemento: { title: "Complemento", placeholder: "Complemento" },
    bairro: { title: "Bairro", placeholder: "Bairro" },
    municipio_endereco_id: { title: "Município do endereço", ...configurarOpcoes(opcoesMunicipios) },
    zona_endereco_id: { title: "Zona do endereço", ...configurarOpcoes(opcoes.zonasEndereco) },
    localizacao_diferenciada_id: { title: "Localização diferenciada", ...configurarOpcoes(opcoes.localizacoesDiferenciadas) },
    cartao_sus: { title: "Cartão SUS", placeholder: "Cartão SUS", inputMode: "numeric", maxLength: 15 },
    situacao_id: { title: "Situação", ...configurarOpcoes(opcoes.situacoes) },
    escolaridade_id: { title: "Escolaridade", ...configurarOpcoes(opcoes.escolaridades) },
    tipo_ensino_medio_cursado_id: { title: "Tipo de ensino médio", ...configurarOpcoes(opcoes.tiposEnsinoMedio) },
    observacao: { title: "Observação", type: "textarea" },
    certidao: { hidden: true },
    cnh: { hidden: true },
    ctps: { hidden: true },
    identidade: { hidden: true },
    titulo_eleitor: { hidden: true },
    contatos: { hidden: true },
  };
  const secoes = [
    {
      titulo: "Identificação",
      campos: [
        "nome_completo", "nome_social", "sexo_id", "genero_id",
        "racacor_id",
        "comunidade_indigena_id", "cpf", "nis_pis",
        { visual: "Matrícula", tamanho: "compacto" as const },
        "estado_civil_id", "uniao_estavel", "ativo",
      ],
    },
    {
      titulo: "Nascimento",
      campos: [
        "data_nascimento", "nacionalidade_id", "pais_origem_id", "ano_chegada_brasil",
        { visual: "UF de nascimento", tamanho: "compacto" as const },
        "municipio_nascimento_id",
      ],
    },
    {
      titulo: "Filiação",
      campos: ["cpf_mae", "nome_mae", "cpf_pai", "nome_pai"],
    },
    {
      titulo: "Documentos",
      campos: [],
    },
    {
      titulo: "Endereço Residencial",
      campos: [
        "cep", "logradouro", "numero", "complemento", "bairro",
        { visual: "UF", tamanho: "compacto" as const },
        "municipio_endereco_id", "zona_endereco_id", "localizacao_diferenciada_id",
      ],
    },
    {
      titulo: "Contatos",
      campos: [],
    },
    {
      titulo: "Matrículas e histórico funcional",
      campos: [],
    },
    {
      titulo: "Formação",
      campos: [
        "escolaridade_id", "tipo_ensino_medio_cursado_id",
        "situacao_id", "cartao_sus", "observacao",
      ],
    },
  ];

  return (
    <>
      <div className="page-head">
        <div>
          <span className="cadastro-eyebrow">Gestão de pessoas</span>
          <h1>Novo Servidor</h1>

          <p>
            Preencha os dados por categoria. Os campos obrigatórios estão indicados no formulário.
          </p>
        </div>

        <button
          type="button"
          className="btn outline"
          onClick={onBack}
        >
          <Icon name="arrow-left" />
          Voltar
        </button>
      </div>

      <div className="card cadastro-servidor">
        <div className="cadastro-intro">
          <span className="cadastro-intro-icon"><Icon name="user-add" /></span>
          <div>
            <strong>Cadastro de servidor</strong>
          </div>
        </div>
        {error && (
          <p className="form-error" role="alert" style={{ whiteSpace: "pre-line" }}>
            {error}
          </p>
        )}
        <FormularioDinamicoContainer
          dominio="servidores"
          operacao="adicionar"
          schemaLocal={criarSchemaLocal(campos, "adicionar", [
            "nome_completo", "cpf", "data_nascimento", "nacionalidade_id", "nome_mae",
            "nome_pai", "sexo_id", "racacor_id", "cep", "logradouro", "bairro",
            "municipio_endereco_id", "zona_endereco_id", "situacao_id",
          ])}
          campos={campos}
          secoes={secoes}
          desabilitado={loading || saving}
          textoSalvar="Cadastrar servidor"
          textoSalvando="Cadastrando..."
          onSubmit={submit}
          onCancel={onBack}
        >
          <section className="novo-servidor-contatos" data-cadastro-secao="Contatos">
            <div className="section-heading">
              <button
                type="button"
                className="btn outline"
                onClick={() => {
                  const id = proximoContatoId.current++;
                  setContatos(items => [...items, {
                    id,
                    tipo: "TELEFONE_MOVEL",
                    valor: "",
                    principal: items.length === 0,
                  }]);
                }}
              >
                <Icon name="add" /> Adicionar contato
              </button>
            </div>
            {contatos.map(contato => (
              <div className="form-grid novo-servidor-contato" key={contato.id}>
                <label>
                  Tipo de contato
                  <select
                    value={contato.tipo}
                    onChange={event => {
                      const tipo = event.target.value as TipoContato;
                      setContatos(items => items.map(item =>
                        item.id === contato.id ? { ...item, tipo, valor: "" } : item,
                      ));
                    }}
                  >
                    <option value="TELEFONE_MOVEL">Celular</option>
                    <option value="TELEFONE_FIXO">Telefone fixo</option>
                    <option value="EMAIL">E-mail</option>
                  </select>
                </label>
                <label>
                  {contato.tipo === "EMAIL" ? "E-mail" : "Telefone com DDD"}
                  <input
                    type={contato.tipo === "EMAIL" ? "email" : "tel"}
                    inputMode={contato.tipo === "EMAIL" ? "email" : "numeric"}
                    maxLength={contato.tipo === "EMAIL" ? 150 : contato.tipo === "TELEFONE_MOVEL" ? 11 : 10}
                    value={contato.valor}
                    onChange={event => setContatos(items => items.map(item =>
                      item.id === contato.id ? { ...item, valor: event.target.value } : item,
                    ))}
                    placeholder={contato.tipo === "EMAIL"
                      ? "nome@exemplo.com"
                      : contato.tipo === "TELEFONE_MOVEL" ? "DDD + 9 dígitos" : "DDD + 8 dígitos"}
                    required
                  />
                </label>
                <label className="document-toggle">
                  <input
                    type="checkbox"
                    checked={contato.principal}
                    onChange={event => setContatos(items => items.map(item =>
                      item.id === contato.id ? { ...item, principal: event.target.checked } : item,
                    ))}
                  />
                  Contato principal
                </label>
                <button
                  type="button"
                  className="btn outline"
                  onClick={() => setContatos(items => items.filter(item => item.id !== contato.id))}
                >
                  Remover
                </button>
              </div>
            ))}
          </section>

          <section className="novo-servidor-matriculas" data-cadastro-secao="Matrículas e histórico funcional">
            <div className="section-heading">
              <div>
                <h3>Matrículas e histórico funcional</h3>
                <p>Adicione os vínculos e os períodos funcionais do servidor.</p>
              </div>
              <button
                type="button"
                className="btn outline"
                onClick={() => setMatriculas(items => [...items, {
                  id: proximoMatriculaId.current++,
                  numero: "",
                  admissao: "",
                  ativo: true,
                  tipo_vinculo_id: "",
                  historicos: [],
                }])}
              >
                <Icon name="add" /> Adicionar matrícula
              </button>
            </div>
            {matriculas.length === 0 && (
              <p className="cadastro-documentos-vazio">Nenhuma matrícula adicionada.</p>
            )}
            {matriculas.map(matricula => (
              <article className="novo-servidor-matricula" key={matricula.id}>
                <div className="cadastro-documento-item-heading">
                  <strong>Matrícula</strong>
                  <button
                    type="button"
                    className="btn outline"
                    onClick={() => setMatriculas(items => items.filter(item => item.id !== matricula.id))}
                  >
                    Remover
                  </button>
                </div>
                <div className="form-grid">
                  <label>
                    Número da matrícula
                    <input
                      required
                      maxLength={50}
                      value={matricula.numero}
                      onChange={event => setMatriculas(items => items.map(item =>
                        item.id === matricula.id ? { ...item, numero: event.target.value } : item,
                      ))}
                    />
                  </label>
                  <label>
                    Data de admissão
                    <input
                      required
                      type="date"
                      value={matricula.admissao}
                      onChange={event => setMatriculas(items => items.map(item =>
                        item.id === matricula.id ? { ...item, admissao: event.target.value } : item,
                      ))}
                    />
                  </label>
                  <label>
                    Tipo de vínculo
                    <select
                      required
                      value={matricula.tipo_vinculo_id}
                      disabled={loading}
                      onChange={event => setMatriculas(items => items.map(item =>
                        item.id === matricula.id ? { ...item, tipo_vinculo_id: event.target.value } : item,
                      ))}
                    >
                      <option value="">Selecione</option>
                      {opcoes.tiposVinculo.map(opcao => (
                        <option key={String(opcao.id)} value={String(opcao.id)}>{opcao.descricao}</option>
                      ))}
                    </select>
                  </label>
                  <label className="document-toggle">
                    <input
                      type="checkbox"
                      checked={matricula.ativo}
                      onChange={event => setMatriculas(items => items.map(item =>
                        item.id === matricula.id ? { ...item, ativo: event.target.checked } : item,
                      ))}
                    />
                    Matrícula ativa
                  </label>
                </div>

                <div className="section-heading novo-servidor-historico-heading">
                  <strong>Histórico funcional</strong>
                  <button
                    type="button"
                    className="btn outline"
                    onClick={() => setMatriculas(items => items.map(item =>
                      item.id === matricula.id
                        ? {
                            ...item,
                            historicos: [...item.historicos, {
                              id: proximoHistoricoId.current++,
                              cargo_id: "",
                              funcao_id: "",
                              departamento_id: "",
                              situacao_id: "",
                              data_inicio: "",
                              data_fim: "",
                            }],
                          }
                        : item,
                    ))}
                  >
                    <Icon name="add" /> Adicionar histórico
                  </button>
                </div>
                {matricula.historicos.map(historico => (
                  <div className="form-grid novo-servidor-historico" key={historico.id}>
                    {([
                      ["cargo_id", "Cargo", opcoes.cargos],
                      ["funcao_id", "Função", opcoes.funcoes],
                      ["departamento_id", "Departamento", opcoes.departamentos],
                      ["situacao_id", "Situação", opcoes.situacoes],
                    ] as const).map(([campo, rotulo, lista]) => (
                      <label key={campo}>
                        {rotulo}
                        <select
                          required
                          value={historico[campo]}
                          disabled={loading}
                          onChange={event => setMatriculas(items => items.map(item => item.id !== matricula.id
                            ? item
                            : {
                                ...item,
                                historicos: item.historicos.map(registro => registro.id === historico.id
                                  ? { ...registro, [campo]: event.target.value }
                                  : registro),
                              },
                          ))}
                        >
                          <option value="">Selecione</option>
                          {lista.map(opcao => (
                            <option key={String(opcao.id)} value={String(opcao.id)}>{opcao.descricao}</option>
                          ))}
                        </select>
                      </label>
                    ))}
                    <label>
                      Início
                      <input
                        required
                        type="date"
                        value={historico.data_inicio}
                        onChange={event => setMatriculas(items => items.map(item => item.id !== matricula.id
                          ? item
                          : {
                              ...item,
                              historicos: item.historicos.map(registro => registro.id === historico.id
                                ? { ...registro, data_inicio: event.target.value }
                                : registro),
                            },
                        ))}
                      />
                    </label>
                    <label>
                      Fim (opcional)
                      <input
                        type="date"
                        value={historico.data_fim}
                        onChange={event => setMatriculas(items => items.map(item => item.id !== matricula.id
                          ? item
                          : {
                              ...item,
                              historicos: item.historicos.map(registro => registro.id === historico.id
                                ? { ...registro, data_fim: event.target.value }
                                : registro),
                            },
                        ))}
                      />
                    </label>
                    <button
                      type="button"
                      className="btn outline"
                      onClick={() => setMatriculas(items => items.map(item => item.id === matricula.id
                        ? { ...item, historicos: item.historicos.filter(registro => registro.id !== historico.id) }
                        : item,
                      ))}
                    >
                      Remover histórico
                    </button>
                  </div>
                ))}
              </article>
            ))}
          </section>

          <section className="cadastro-documentos" data-cadastro-secao="Documentos">
            <div className="section-heading cadastro-documentos-heading">
              {documentos.length < tiposDocumento.length && (
                <button
                  type="button"
                  className="btn outline"
                  onClick={() => {
                    const tipo = tiposDocumento.find(opcao =>
                      !documentos.some(documento => documento.tipo === opcao.tipo),
                    )?.tipo;
                    if (!tipo) return;
                    setDocumentos(items => [...items, {
                      id: proximoDocumentoId.current++,
                      tipo,
                    }]);
                  }}
                >
                  <Icon name="add" /> Adicionar documento
                </button>
              )}
            </div>
            {documentos.length === 0 && (
              <p className="cadastro-documentos-vazio">Nenhum documento adicionado.</p>
            )}
            {documentos.map(documento => (
              <div className="cadastro-documento-item" key={documento.id}>
                <div className="cadastro-documento-item-heading">
                  <label>
                    Tipo de documento
                    <select
                      value={documento.tipo}
                      onChange={event => {
                        const tipo = event.target.value as TipoDocumento;
                        setDocumentos(items => items.map(item =>
                          item.id === documento.id ? { ...item, tipo } : item,
                        ));
                      }}
                    >
                      {tiposDocumento.map(opcao => (
                        <option
                          key={opcao.tipo}
                          value={opcao.tipo}
                          disabled={documentos.some(item => item.id !== documento.id && item.tipo === opcao.tipo)}
                        >
                          {opcao.titulo}
                        </option>
                      ))}
                    </select>
                  </label>
                  <button
                    type="button"
                    className="btn outline cadastro-documento-remover"
                    onClick={() => setDocumentos(items => items.filter(item => item.id !== documento.id))}
                  >
                    Remover
                  </button>
                </div>
                {documento.tipo === "certidao" && <div className="form-grid">
                  <label>Tipo de certidão<select name="certidao_tipo" defaultValue="NASCIMENTO"><option value="NASCIMENTO">Nascimento</option><option value="CASAMENTO">Casamento</option></select></label>
                  <label>Modelo<select name="certidao_nova" value={String(certidaoNova)} onChange={e => setCertidaoNova(e.target.value === "true")}><option value="true">Nova</option><option value="false">Antiga</option></select></label>
                  <label>Matrícula (32 dígitos)<input name="certidao_matricula" inputMode="numeric" maxLength={32} required /></label>
                  <label>Data de emissão<input name="certidao_data_emissao" type="date" required /></label>
                  {!certidaoNova && <>
                    <label>Termo (5 dígitos)<input name="certidao_termo" inputMode="numeric" maxLength={5} required /></label>
                    <label>Folha (5 dígitos)<input name="certidao_folha" inputMode="numeric" maxLength={5} required /></label>
                    <label>Livro (5 dígitos)<input name="certidao_livro" inputMode="numeric" maxLength={5} required /></label>
                  </>}
                </div>}
                {documento.tipo === "cnh" && <div className="form-grid">
                  <label>Número da CNH (11 dígitos)<input name="cnh_numero" inputMode="numeric" maxLength={11} required /></label>
                  <label>Categoria<input name="cnh_categoria" maxLength={15} required /></label>
                  <label>Data de emissão<input name="cnh_data_emissao" type="date" required /></label>
                  <label>Data de validade<input name="cnh_data_validade" type="date" required /></label>
                </div>}
                {documento.tipo === "ctps" && <div className="form-grid">
                  <label>Tipo de CTPS<select name="ctps_tipo" value={ctpsAntiga ? "ANTIGO" : "NOVO"} onChange={e => setCtpsAntiga(e.target.value === "ANTIGO")}><option value="ANTIGO">Antiga</option><option value="NOVO">Digital/nova</option></select></label>
                  {ctpsAntiga && <>
                    <label>Número (CTPS antiga)<input name="ctps_numero" inputMode="numeric" maxLength={8} required /></label>
                    <label>Série (CTPS antiga)<input name="ctps_serie" inputMode="numeric" maxLength={5} required /></label>
                    <SelectApi name="ctps_uf_id" label="UF da CTPS" options={opcoesEstados} required />
                  </>}
                  <label>Data de emissão<input name="ctps_data_emissao" type="date" required /></label>
                </div>}
                {documento.tipo === "identidade" && <div className="form-grid">
                  <label>Tipo de identidade<select name="identidade_tipo" value={identidadeTipo} onChange={e => setIdentidadeTipo(e.target.value as "RG" | "CIN")}><option value="RG">RG</option><option value="CIN">CIN</option></select></label>
                  {identidadeTipo === "RG" && <label>Número do RG<input name="identidade_numero" inputMode="numeric" maxLength={30} required /></label>}
                  <label>Órgão emissor<input name="identidade_orgao" maxLength={30} required /></label>
                  <SelectApi name="identidade_uf_id" label="UF da identidade" options={opcoesEstados} required />
                  <label>Data de emissão<input name="identidade_data_emissao" type="date" required /></label>
                </div>}
                {documento.tipo === "tituloEleitor" && <div className="form-grid">
                  <label>Número (12 dígitos)<input name="titulo_numero" inputMode="numeric" maxLength={12} required /></label>
                  <label>Zona eleitoral (4 dígitos)<input name="titulo_zona" inputMode="numeric" maxLength={4} required /></label>
                  <label>Seção (4 dígitos)<input name="titulo_secao" inputMode="numeric" maxLength={4} required /></label>
                </div>}
              </div>
            ))}
          </section>
        </FormularioDinamicoContainer>
      </div>
    </>
  );
}
