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

function formatarDataParaApi(data: string): string {
  if (!data) {
    return "";
  }

  const partes = data.split("-");

  if (partes.length !== 3) {
    return "";
  }

  const [ano, mes, dia] = partes;

  if (!ano || !mes || !dia) {
    return "";
  }

  return `${dia}/${mes}/${ano}`;
}

export default function NovoServidor({
  onBack,
}: Props) {
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [opcoes, setOpcoes] =
    useState<Opcoes>(opcoesVazias);

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
    ): string | null => {
      const value = String(
        form.get(name) ?? ""
      ).trim();

      return value || null;
    };

    /**
     * ID:
     * vazio = null
     * preenchido = número
     */
    const id = (
      name: string
    ): number | null => {
      const value = String(
        form.get(name) ?? ""
      ).trim();

      if (!value) {
        return null;
      }

      const convertido = Number(value);

      if (
        !Number.isInteger(convertido) ||
        convertido <= 0
      ) {
        return null;
      }

      return convertido;
    };

    /**
     * Documento:
     * remove máscara e caracteres não numéricos.
     */
    const documento = (
      name: string
    ): string | null => {
      const value = String(
        form.get(name) ?? ""
      ).trim();

      const somenteNumeros =
        value.replace(/\D/g, "");

      return somenteNumeros || null;
    };

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
            <p className="form-error">
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
            <label>
              Nacionalidade ID

              <input
                name="nacionalidade_id"
                type="number"
                placeholder="ID da nacionalidade"
                required
              />
            </label>

            <label>
              País de origem ID

              <input
                name="pais_origem_id"
                type="number"
                placeholder="ID do país"
              />
            </label>

            <label>
              Ano de chegada ao Brasil

              <input
                name="ano_chegada_brasil"
                type="number"
                placeholder="Ano"
              />
            </label>

            <label>
              Município de nascimento ID

              <input
                name="municipio_nascimento_id"
                type="number"
                placeholder="ID do município"
              />
            </label>

            <label>
              Município do endereço ID

              <input
                name="municipio_endereco_id"
                type="number"
                placeholder="ID do município"
                required
              />
            </label>

            <label>
              Cartão SUS

              <input
                name="cartao_sus"
                placeholder="Cartão SUS"
                inputMode="numeric"
              />
            </label>
          </div>

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