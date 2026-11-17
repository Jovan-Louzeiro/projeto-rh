import { useEffect, useMemo, useState } from "react";

import type {
  LicencaAfastamento,
  Servidor,
} from "../types";

import {
  criarLicencaParaServidor,
  listarLicencasServidor,
} from "../services/licencas";

import { listarServidores } from "../services/servidores";

import Icon from "../components/Icon";

type Props = {
  servidorIdInicial: string;
  onBack: () => void;
};

type Form = {
  servidorId: string;
  tipo: string;
  inicio: string;
  termino: string | null;
  semDataTermino: boolean;
  previsaoRetorno: string | null;
  documento: string;
  numeroDocumento: string;
  dataDocumento: string;
  orgaoEmissor: string;
  observacoes: string;
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
};

export default function NovaLicenca({ servidorIdInicial, onBack }: Props) {
  const [form, setForm] = useState<Form>(() => ({ ...inicial, servidorId: servidorIdInicial }));
  const [servidores, setServidores] = useState<Servidor[]>([]);
  const [registros, setRegistros] = useState<LicencaAfastamento[]>([]);
  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [carregandoServidores, setCarregandoServidores] =
    useState(true);

  useEffect(() => {
    const controller = new AbortController();

    async function carregarDados() {
      setCarregandoServidores(true);

      try {
        const [lista, licencas] = await Promise.all([
          listarServidores(controller.signal),
          listarLicencasServidor(servidorIdInicial, controller.signal),
        ]);

        if (controller.signal.aborted) return;

        setServidores(lista);
        setRegistros(licencas);
        setForm({ ...inicial, servidorId: servidorIdInicial });
        setErro("");
      } catch (erro: unknown) {
        if (
          erro instanceof DOMException &&
          erro.name === "AbortError"
        ) {
          return;
        }

        console.error(
          "[NovaLicenca] Erro ao carregar dados:",
          erro
        );

        setErro(
          erro instanceof Error
            ? erro.message
            : "Não foi possível carregar os dados para registrar a licença."
        );
      } finally {
        if (!controller.signal.aborted) {
          setCarregandoServidores(false);
        }
      }
    }

    carregarDados();

    return () => controller.abort();
  }, [servidorIdInicial]);

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
      setErro("Não foi possível localizar o servidor deste perfil.");
      return;
    }

    const mensagem = validar(form, registros);

    if (mensagem) {
      setErro(mensagem);
      return;
    }

    setSalvando(true);

    try {
      await criarLicencaParaServidor(servidorIdInicial, {
        ...form,
        termino: form.semDataTermino ? null : form.termino,
        previsaoRetorno: form.previsaoRetorno ?? form.termino,
      }, arquivo);

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
          <Info label="Servidor" value={servidor?.nome ?? (carregandoServidores ? "Carregando..." : "Servidor não encontrado")} />

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
              accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
              onChange={(e) => {
                const selecionado = e.target.files?.[0] ?? null;
                if (selecionado && selecionado.size > 10 * 1024 * 1024) {
                  setErro("O documento não pode ultrapassar 10 MB.");
                  e.target.value = "";
                  setArquivo(null);
                  atualizar("documento", "");
                  return;
                }
                if (selecionado && !["application/pdf", "image/jpeg", "image/png"].includes(selecionado.type)) {
                  setErro("O anexo deve ser PDF, JPG ou PNG.");
                  e.target.value = "";
                  setArquivo(null);
                  atualizar("documento", "");
                  return;
                }
                setErro("");
                setArquivo(selecionado);
                atualizar("documento", selecionado?.name ?? "");
              }}
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
