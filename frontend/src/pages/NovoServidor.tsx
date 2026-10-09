import {
  FormEvent,
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

import Icon from "../components/Icon";
import { carregarDadosGeograficos, type DadosGeograficos } from "../services/localizacao";

type Props = {
  onBack: () => void;
};

type Opcoes = {
  sexos: OpcaoServidor[];
  generos: OpcaoServidor[];
  racasCor: OpcaoServidor[];
  estadosCivis: OpcaoServidor[];
  cargos: OpcaoServidor[];
  departamentos: OpcaoServidor[];
  tiposVinculo: OpcaoServidor[];
  escolaridades: OpcaoServidor[];
  tiposEnsinoMedio: OpcaoServidor[];
  zonasEndereco: OpcaoServidor[];
  localizacoesDiferenciadas: OpcaoServidor[];
  comunidadesIndigenas: OpcaoServidor[];
  situacoes: OpcaoServidor[];
};

const opcoesVazias: Opcoes = {
  sexos: [],
  generos: [],
  racasCor: [],
  estadosCivis: [],
  cargos: [],
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
  const [documentosIncluidos, setDocumentosIncluidos] = useState({
    certidao: false,
    cnh: false,
    ctps: false,
    identidade: false,
    tituloEleitor: false,
  });
  const [certidaoNova, setCertidaoNova] = useState(true);
  const [ctpsAntiga, setCtpsAntiga] = useState(true);

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

  async function submit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setSaving(true);
    setError("");

    const form = new FormData(
      event.currentTarget
    );

    /**
     * Texto:
     * vazio = null
     */
    const texto = (
      name: string
    ): string | undefined => {
      const value = String(
        form.get(name) ?? ""
      ).trim();

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
      const value = String(
        form.get(name) ?? ""
      ).trim();

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
      const value = String(
        form.get(name) ?? ""
      ).trim();

      const somenteNumeros =
        value.replace(/\D/g, "");

      return somenteNumeros || undefined;
    };

    const campo = (name: string) => texto(name);
    const numeroDocumento = (name: string) => documento(name);

    const dataNascimento = String(
      form.get("data_nascimento") ?? ""
    ).trim();

    /**
     * Payload exatamente no formato
     * esperado pelo serviço/backend.
     *
     * Os relacionamentos são enviados como IDs.
     */
    const dados: NovoServidorDados = {
      ativo: true,

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
        form.get("uniao_estavel") ===
        "true",

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
            nova_certidao: form.get("certidao_nova") === "true",
            matricula: numeroDocumento("certidao_matricula"),
            tipo_certidao: campo("certidao_tipo"),
            data_emissao: campo("certidao_data_emissao"),
            ...(form.get("certidao_nova") === "true"
              ? {}
              : {
                  termo: numeroDocumento("certidao_termo"),
                  folha: numeroDocumento("certidao_folha"),
                  livro: numeroDocumento("certidao_livro"),
                }),
          }
        : undefined,

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
            ...(form.get("ctps_tipo") === "ANTIGO"
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
            tipo_identidade: campo("identidade_tipo"),
            // O schema atual do backend ainda exige `numero` para CIN.
            numero: numeroDocumento("identidade_numero"),
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
      console.log(
        "===================================="
      );

      console.log(
        "POST /api/servidores"
      );

      console.log(
        "Dados enviados:",
        dados
      );

      console.log(
        "JSON:",
        JSON.stringify(
          dados,
          null,
          2
        )
      );

      console.log(
        "===================================="
      );

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
            {loading
              ? "Carregando..."
              : `Selecione ${label.toLowerCase()}`}
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

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Novo Servidor</h1>

          <p>
            Cadastre os dados pessoais do servidor.
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
        <form onSubmit={submit}>
          {error && (
            <p className="form-error" role="alert" style={{ whiteSpace: "pre-line" }}>
              {error}
            </p>
          )}

          <h2>Dados pessoais</h2>

          <div className="form-grid">
            <label>
              Nome completo

              <input
                name="nome_completo"
                placeholder="Nome completo"
                required
              />
            </label>

            <label>
              Nome social

              <input
                name="nome_social"
                placeholder="Nome social"
              />
            </label>

            <label>
              CPF

              <input
                name="cpf"
                placeholder="CPF"
                inputMode="numeric"
                maxLength={14}
                required
              />
            </label>

            <label>
              NIS/PIS

              <input
                name="nis_pis"
                placeholder="NIS/PIS"
                inputMode="numeric"
              />
            </label>

            <label>
              Data de nascimento

              <input
                name="data_nascimento"
                type="date"
                required
              />
            </label>

            <SelectApi
              name="sexo_id"
              label="Sexo"
              options={opcoes.sexos}
              required
            />

            <SelectApi
              name="genero_id"
              label="Gênero"
              options={opcoes.generos}
            />

            <SelectApi
              name="racacor_id"
              label="Raça/Cor"
              options={opcoes.racasCor}
              required
            />

            <SelectApi
              name="estado_civil_id"
              label="Estado civil"
              options={opcoes.estadosCivis}
            />

            <SelectApi
              name="situacao_id"
              label="Situação"
              options={opcoes.situacoes}
              required
            />

            <label>
              União estável

              <select
                name="uniao_estavel"
                defaultValue="false"
              >
                <option value="false">
                  Não
                </option>

                <option value="true">
                  Sim
                </option>
              </select>
            </label>
          </div>

          <h2>Filiação</h2>

          <div className="form-grid">
            <label>
              Nome da mãe

              <input
                name="nome_mae"
                placeholder="Nome da mãe"
                required
              />
            </label>

            <label>
              CPF da mãe

              <input
                name="cpf_mae"
                placeholder="CPF da mãe"
                inputMode="numeric"
                maxLength={14}
              />
            </label>

            <label>
              Nome do pai

              <input
                name="nome_pai"
                placeholder="Nome do pai"
                required
              />
            </label>

            <label>
              CPF do pai

              <input
                name="cpf_pai"
                placeholder="CPF do pai"
                inputMode="numeric"
                maxLength={14}
              />
            </label>
          </div>

          <h2>Dados educacionais</h2>

          <div className="form-grid">
            <SelectApi
              name="escolaridade_id"
              label="Escolaridade"
              options={opcoes.escolaridades}
            />

            <SelectApi
              name="tipo_ensino_medio_cursado_id"
              label="Tipo de ensino médio"
              options={
                opcoes.tiposEnsinoMedio
              }
            />
          </div>

          <h2>Endereço</h2>

          <div className="form-grid">
            <label>
              CEP

              <input
                name="cep"
                placeholder="CEP"
                inputMode="numeric"
                maxLength={9}
                required
              />
            </label>

            <label>
              Logradouro

              <input
                name="logradouro"
                placeholder="Rua, avenida..."
                required
              />
            </label>

            <label>
              Número

              <input
                name="numero"
                placeholder="Número"
              />
            </label>

            <label>
              Complemento

              <input
                name="complemento"
                placeholder="Complemento"
              />
            </label>

            <label>
              Bairro

              <input
                name="bairro"
                placeholder="Bairro"
                required
              />
            </label>

            <SelectApi
              name="zona_endereco_id"
              label="Zona do endereço"
              options={
                opcoes.zonasEndereco
              }
              required
            />

            <SelectApi
              name="localizacao_diferenciada_id"
              label="Localização diferenciada"
              options={
                opcoes.localizacoesDiferenciadas
              }
            />

            <SelectApi
              name="comunidade_indigena_id"
              label="Comunidade indígena"
              options={
                opcoes.comunidadesIndigenas
              }
            />
          </div>

          <h2>Outros dados</h2>

          <div className="form-grid">
            <SelectApi name="nacionalidade_id" label="Nacionalidade" options={opcoesPaises} required />

            <SelectApi name="pais_origem_id" label="País de origem" options={opcoesPaises} />

            <label>
              Ano de chegada ao Brasil

              <input
                name="ano_chegada_brasil"
                type="number"
                placeholder="Ano"
              />
            </label>

            <SelectApi name="municipio_nascimento_id" label="Município de nascimento" options={opcoesMunicipios} />

            <SelectApi name="municipio_endereco_id" label="Município do endereço" options={opcoesMunicipios} required />

            <label>
              Cartão SUS

              <input
                name="cartao_sus"
                placeholder="Cartão SUS"
                inputMode="numeric"
              />
            </label>
          </div>

          <h2>Documentos (opcionais)</h2>
          <p className="muted">Marque os documentos que deseja cadastrar junto com o servidor.</p>

          <label className="document-toggle">
            <input type="checkbox" checked={documentosIncluidos.certidao} onChange={e => setDocumentosIncluidos(v => ({ ...v, certidao: e.target.checked }))} />
            Incluir certidão
          </label>
          {documentosIncluidos.certidao && <div className="form-grid">
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

          <label className="document-toggle">
            <input type="checkbox" checked={documentosIncluidos.cnh} onChange={e => setDocumentosIncluidos(v => ({ ...v, cnh: e.target.checked }))} />
            Incluir CNH
          </label>
          {documentosIncluidos.cnh && <div className="form-grid">
            <label>Número da CNH (11 dígitos)<input name="cnh_numero" inputMode="numeric" maxLength={11} required /></label>
            <label>Categoria<input name="cnh_categoria" maxLength={15} required /></label>
            <label>Data de emissão<input name="cnh_data_emissao" type="date" required /></label>
            <label>Data de validade<input name="cnh_data_validade" type="date" required /></label>
          </div>}

          <label className="document-toggle">
            <input type="checkbox" checked={documentosIncluidos.ctps} onChange={e => setDocumentosIncluidos(v => ({ ...v, ctps: e.target.checked }))} />
            Incluir CTPS
          </label>
          {documentosIncluidos.ctps && <div className="form-grid">
            <label>Tipo de CTPS<select name="ctps_tipo" value={ctpsAntiga ? "ANTIGO" : "NOVO"} onChange={e => setCtpsAntiga(e.target.value === "ANTIGO")}><option value="ANTIGO">Antiga</option><option value="NOVO">Digital/nova</option></select></label>
            {ctpsAntiga && <>
              <label>Número (CTPS antiga)<input name="ctps_numero" inputMode="numeric" maxLength={8} required /></label>
              <label>Série (CTPS antiga)<input name="ctps_serie" inputMode="numeric" maxLength={5} required /></label>
              <SelectApi name="ctps_uf_id" label="UF da CTPS" options={opcoesEstados} required />
            </>}
            <label>Data de emissão<input name="ctps_data_emissao" type="date" required /></label>
          </div>}

          <label className="document-toggle">
            <input type="checkbox" checked={documentosIncluidos.identidade} onChange={e => setDocumentosIncluidos(v => ({ ...v, identidade: e.target.checked }))} />
            Incluir identidade
          </label>
          {documentosIncluidos.identidade && <div className="form-grid">
            <label>Tipo<select name="identidade_tipo" defaultValue="RG"><option value="RG">RG</option><option value="CIN">CIN</option></select></label>
            <label>Número do RG ou CPF da CIN<input name="identidade_numero" inputMode="numeric" maxLength={30} required /></label>
            <label>Órgão emissor<input name="identidade_orgao" maxLength={30} required /></label>
            <SelectApi name="identidade_uf_id" label="UF da identidade" options={opcoesEstados} required />
            <label>Data de emissão<input name="identidade_data_emissao" type="date" required /></label>
          </div>}

          <label className="document-toggle">
            <input type="checkbox" checked={documentosIncluidos.tituloEleitor} onChange={e => setDocumentosIncluidos(v => ({ ...v, tituloEleitor: e.target.checked }))} />
            Incluir título de eleitor
          </label>
          {documentosIncluidos.tituloEleitor && <div className="form-grid">
            <label>Número (12 dígitos)<input name="titulo_numero" inputMode="numeric" maxLength={12} required /></label>
            <label>Zona eleitoral (4 dígitos)<input name="titulo_zona" inputMode="numeric" maxLength={4} required /></label>
            <label>Seção (4 dígitos)<input name="titulo_secao" inputMode="numeric" maxLength={4} required /></label>
          </div>}

          <label>
            Observação

            <textarea
              name="observacao"
              placeholder="Observações"
              rows={4}
            />
          </label>

          <div className="form-actions">
            <button
              type="button"
              className="btn outline"
              onClick={onBack}
              disabled={saving}
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="btn primary"
              disabled={saving || loading}
            >
              {saving
                ? "Cadastrando..."
                : "Cadastrar servidor"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
