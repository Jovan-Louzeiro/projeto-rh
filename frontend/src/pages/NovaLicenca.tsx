import { useEffect, useMemo, useState } from "react";

import type {
  LicencaAfastamento,
  Servidor,
  SituacaoLicenca,
} from "../types";

import {
  listarLicencas,
  salvarLicenca,
} from "../services/licencas";

import { listarServidores } from "../services/servidores";

import Icon from "../components/Icon";

type Props = {
  onBack: () => void;
};

type Form = Omit<
  LicencaAfastamento,
  | "id"
  | "servidor"
  | "matricula"
  | "cpf"
  | "cargo"
  | "secretaria"
  | "dias"
  | "situacao"
> & {
  documento: string;
  situacao: SituacaoLicenca;
};

const inicial: Form = {
  servidorId: "",
  tipo: "",
  inicio: "",
  termino: null,
  semDataTermino: false,
  previsaoRetorno: null,
  documento: "",
  numeroDocumento: "",
  dataDocumento: "",
  orgaoEmissor: "",
  observacoes: "",
  situacao: "Pendente",
};

const situacoes: SituacaoLicenca[] = [
  "Pendente",
  "Em análise",
  "Aprovada",
  "Rejeitada",
  "Em andamento",
  "Encerrada",
  "Cancelada",
];

export default function NovaLicenca({ onBack }: Props) {
  const [form, setForm] = useState<Form>(inicial);
  const [servidores, setServidores] = useState<Servidor[]>([]);
  const [registros, setRegistros] = useState<LicencaAfastamento[]>([]);
  const [erro, setErro] = useState("");
  const [erroLicencas, setErroLicencas] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [carregandoServidores, setCarregandoServidores] =
    useState(true);

  useEffect(() => {
    const controller = new AbortController();

    async function carregarServidores() {
      setCarregandoServidores(true);

      try {
        const lista = await listarServidores(controller.signal);

        if (controller.signal.aborted) return;

        console.log(
          "[NovaLicenca] Servidores carregados:",
          lista
        );

        setServidores(lista);
        setErro("");
      } catch (erro: unknown) {
        if (
          erro instanceof DOMException &&
          erro.name === "AbortError"
        ) {
          return;
        }

        console.error(
          "[NovaLicenca] Erro ao carregar servidores:",
          erro
        );

        setErro(
          erro instanceof Error
            ? erro.message
            : "Não foi possível carregar os servidores."
        );
      } finally {
        if (!controller.signal.aborted) {
          setCarregandoServidores(false);
        }
      }
    }

    async function carregarLicencas() {
      try {
        const lista = await listarLicencas(controller.signal);

        if (controller.signal.aborted) return;

        setRegistros(lista);
        setErroLicencas("");
      } catch (erro: unknown) {
        if (
          erro instanceof DOMException &&
          erro.name === "AbortError"
        ) {
          return;
        }

        console.error(
          "[NovaLicenca] Erro ao carregar licenças:",
          erro
        );

        setErroLicencas(
          "Não foi possível carregar os registros anteriores de licenças."
        );
      }
    }

    carregarServidores();
    carregarLicencas();

    return () => controller.abort();
  }, []);

  const servidor = useMemo(
    () =>
      servidores.find(
        (s) => String(s.id) === String(form.servidorId)
      ),
    [servidores, form.servidorId]
  );

  const dias = diasEntre(form.inicio, form.termino);

  const atualizar = <K extends keyof Form>(
    campo: K,
    valor: Form[K]
  ) => {
    setForm((atual) => ({
      ...atual,
      [campo]: valor,
    }));
  };

  async function salvar() {
    setErro("");

    if (!servidor) {
      setErro("Selecione um servidor cadastrado.");
      return;
    }

    const mensagem = validar(form, registros);

    if (mensagem) {
      setErro(mensagem);
      return;
    }

    setSalvando(true);

    try {
      await salvarLicenca({
        ...form,
        servidor: servidor.nome,
        matricula: servidor.matricula,
        cpf: servidor.cpf ?? "",
        cargo: servidor.cargo,
        secretaria: servidor.secretaria,
        dias: form.semDataTermino ? null : dias,
        termino: form.semDataTermino ? null : form.termino,
        previsaoRetorno: form.semDataTermino
          ? form.previsaoRetorno
          : form.previsaoRetorno ?? form.termino,
      });

      onBack();
    } catch (erro: unknown) {
      console.error("[NovaLicenca] Erro ao salvar:", erro);

      setErro(
        erro instanceof Error
          ? erro.message
          : "Não foi possível salvar a licença. Verifique a conexão com a API."
      );
    } finally {
      setSalvando(false);
    }
  }

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Novo registro de licença</h1>
          <p>Registre licenças e afastamentos do servidor.</p>
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
        <div className="form-grid ferias-form">
          <label className="full-col">
            Servidor

            <select
              value={form.servidorId}
              onChange={(e) =>
                atualizar("servidorId", e.target.value)
              }
              disabled={carregandoServidores}
              required
            >
              <option value="">
                {carregandoServidores
                  ? "Carregando servidores..."
                  : "Selecione o servidor"}
              </option>

              {servidores.map((s) => (
                <option key={s.id} value={String(s.id)}>
                  {s.nome}
                </option>
              ))}
            </select>
          </label>

          <Info
            label="Matrícula"
            value={servidor?.matricula}
          />

          <Info
            label="CPF"
            value={servidor?.cpf}
          />

          <Info
            label="Cargo"
            value={servidor?.cargo}
          />

          <Info
            label="Secretaria"
            value={servidor?.secretaria}
          />

          <Campo
            label="Tipo de licença/afastamento"
            value={form.tipo}
            onChange={(v) => atualizar("tipo", v)}
          />

          <Campo
            label="Data de início"
            type="date"
            value={form.inicio}
            onChange={(v) => atualizar("inicio", v)}
          />

          <Campo
            label="Data de término"
            type="date"
            value={form.termino ?? ""}
            disabled={form.semDataTermino}
            onChange={(v) => atualizar("termino", v || null)}
          />

          <label>
            Sem data de término

            <select
              value={form.semDataTermino ? "sim" : "nao"}
              onChange={(e) =>
                atualizar(
                  "semDataTermino",
                  e.target.value === "sim"
                )
              }
            >
              <option value="nao">Não</option>
              <option value="sim">Sim</option>
            </select>
          </label>

          <Info
            label="Dias"
            value={
              form.semDataTermino
                ? "—"
                : dias
                  ? String(dias)
                  : "—"
            }
          />

          <Campo
            label="Previsão de retorno"
            type="date"
            value={form.previsaoRetorno ?? ""}
            onChange={(v) =>
              atualizar("previsaoRetorno", v || null)
            }
          />

          <label>
            Documento/comprovante

            <input
              type="file"
              onChange={(e) =>
                atualizar(
                  "documento",
                  e.target.files?.[0]?.name ?? ""
                )
              }
            />
          </label>

          <Info
            label="Arquivo selecionado"
            value={form.documento || "Nenhum arquivo"}
          />

          <Campo
            label="Número do documento"
            value={form.numeroDocumento}
            onChange={(v) => atualizar("numeroDocumento", v)}
          />

          <Campo
            label="Data do documento"
            type="date"
            value={form.dataDocumento}
            onChange={(v) => atualizar("dataDocumento", v)}
          />

          <Campo
            label="Órgão emissor"
            value={form.orgaoEmissor}
            onChange={(v) => atualizar("orgaoEmissor", v)}
          />

          <label>
            Situação

            <select
              value={form.situacao}
              onChange={(e) =>
                atualizar(
                  "situacao",
                  e.target.value as SituacaoLicenca
                )
              }
            >
              {situacoes.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>

          <label className="full-col">
            Observações

            <textarea
              value={form.observacoes}
              onChange={(e) =>
                atualizar("observacoes", e.target.value)
              }
              placeholder="Observações adicionais"
            />
          </label>
        </div>

        {erro && <p className="form-error">{erro}</p>}

        {erroLicencas && (
          <p className="form-error">{erroLicencas}</p>
        )}

        <div className="form-actions">
          <button
            type="button"
            className="btn outline"
            onClick={onBack}
          >
            Cancelar
          </button>

          <button
            type="button"
            className="btn primary"
            onClick={salvar}
            disabled={salvando || carregandoServidores}
          >
            {salvando ? "Salvando..." : "Salvar registro"}
          </button>
        </div>
      </div>
    </>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value?: string | number | null;
}) {
  return (
    <label>
      {label}
      <input value={value ?? "—"} readOnly />
    </label>
  );
}

function Campo({
  label,
  type = "text",
  value,
  disabled = false,
  onChange,
}: {
  label: string;
  type?: string;
  value: string;
  disabled?: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <label>
      {label}

      <input
        type={type}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        required={!disabled}
      />
    </label>
  );
}

function diasEntre(inicio: string, termino: string | null) {
  if (!inicio || !termino) {
    return 0;
  }

  const a = Date.parse(`${inicio}T00:00:00Z`);
  const b = Date.parse(`${termino}T00:00:00Z`);

  return b < a ? 0 : Math.floor((b - a) / 86400000) + 1;
}

function validar(
  form: Form,
  registros: LicencaAfastamento[]
) {
  if (!form.tipo.trim() || !form.inicio) {
    return "Preencha o tipo e a data de início.";
  }

  if (!form.semDataTermino && !form.termino) {
    return "Informe a data de término ou selecione a opção sem data de término.";
  }

  if (form.termino && form.termino < form.inicio) {
    return "A data de término deve ser posterior à data de início.";
  }

  const fim = form.semDataTermino
    ? "9999-12-31"
    : form.termino ?? "9999-12-31";

  const existeSobreposicao = registros.some(
    (r) =>
      String(r.servidorId) === String(form.servidorId) &&
      r.situacao !== "Cancelada" &&
      form.inicio <= (r.termino ?? "9999-12-31") &&
      fim >= r.inicio
  );

  return existeSobreposicao
    ? "Já existe uma licença ou afastamento sobreposto para este servidor."
    : "";
}
