import { useState } from "react";
import type {
  FormEvent,
  ChangeEvent,
  ReactNode,
} from "react";

import type {
  CampoFormularioConfig,
  JsonSchema,
  JsonSchemaProperty,
} from "../../types/json-schema.types";

type Props = {
  schema: JsonSchema;
  valoresIniciais?: Record<string, unknown>;
  campos?: Record<string, CampoFormularioConfig>;
  textoSalvar?: string;
  textoSalvando?: string;
  desabilitado?: boolean;
  onCancel?: () => void;
  children?: ReactNode;
  onSubmit: (dados: Record<string, unknown>, formulario: FormData) => void | Promise<void>;
};

export function FormularioDinamico({
  schema,
  valoresIniciais = {},
  campos = {},
  textoSalvar = "Salvar",
  textoSalvando = "Enviando...",
  desabilitado = false,
  onCancel,
  children,
  onSubmit,
}: Props) {
  const [dados, setDados] = useState<Record<string, unknown>>(
    () => {
      const valores = { ...valoresIniciais };

      for (const [nome, campo] of Object.entries(schema.properties ?? {})) {
        const configuracao = campos[nome];
        if (configuracao?.type === "password") {
          valores[nome] = "";
          continue;
        }
        if (valores[nome] !== undefined) continue;

        const tipo = Array.isArray(campo.type)
          ? campo.type.find((item) => item !== "null")
          : campo.type;
        valores[nome] = configuracao?.defaultValue
          ?? campo.default
          ?? (tipo === "boolean" ? false : "");
      }

      return valores;
    }
  );

  const [enviando, setEnviando] = useState(false);
  const [errosCampos, setErrosCampos] = useState<Record<string, string>>({});
  const [erroGeral, setErroGeral] = useState("");

  function campoVisivel(nome: string): boolean {
    const condicao = campos[nome]?.visibleWhen;
    return !campos[nome]?.hidden
      && (!condicao || String(dados[condicao.field]) === String(condicao.equals));
  }

  function campoObrigatorio(nome: string): boolean {
    const condicao = campos[nome]?.requiredWhen;
    if (condicao) {
      return String(dados[condicao.field]) === String(condicao.equals);
    }
    return schema.required?.includes(nome) ?? false;
  }

  function atualizarCampo(
    nome: string,
    evento: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    const campo = schema.properties?.[nome];

    if (!campo) return;

    const valor = evento.target instanceof HTMLInputElement && evento.target.type === "checkbox"
      ? evento.target.checked
      : evento.target instanceof HTMLInputElement && evento.target.type === "number"
        ? evento.target.value === ""
          ? ""
          : Number(evento.target.value)
        : evento.target.value;

    setDados((anteriores) => ({
      ...anteriores,
      [nome]: valor,
    }));
    setErrosCampos((anteriores) => {
      if (!anteriores[nome]) return anteriores;
      const proximos = { ...anteriores };
      delete proximos[nome];
      return proximos;
    });
    setErroGeral("");
  }

  function extrairErros(error: unknown): { campos: Record<string, string>; geral: string } {
    const mensagemGeral = error instanceof Error ? error.message : "Não foi possível salvar os dados.";
    if (!error || typeof error !== "object" || !("data" in error)) {
      return { campos: {}, geral: mensagemGeral };
    }

    const data = error.data;
    if (!data || typeof data !== "object" || !("detalhes" in data) || !Array.isArray(data.detalhes)) {
      return { campos: {}, geral: mensagemGeral };
    }

    const camposComErro: Record<string, string> = {};
    const errosSemCampo: string[] = [];
    for (const detalhe of data.detalhes) {
      if (!detalhe || typeof detalhe !== "object") continue;
      const issue = detalhe as { campo?: unknown; path?: unknown; mensagem?: unknown; message?: unknown };
      const caminho = typeof issue.campo === "string"
        ? issue.campo
        : Array.isArray(issue.path)
          ? issue.path.filter((parte): parte is string | number => typeof parte === "string" || typeof parte === "number").join(".")
          : "";
      const mensagem = typeof issue.mensagem === "string"
        ? issue.mensagem
        : typeof issue.message === "string"
          ? issue.message
          : "Valor inválido.";

      if (caminho && schema.properties?.[caminho]) {
        camposComErro[caminho] = camposComErro[caminho]
          ? `${camposComErro[caminho]} ${mensagem}`
          : mensagem;
      } else {
        errosSemCampo.push(mensagem);
      }
    }

    return {
      campos: camposComErro,
      geral: errosSemCampo.length
        ? errosSemCampo.join(" ")
        : Object.keys(camposComErro).length
          ? ""
          : mensagemGeral,
    };
  }

  async function enviarFormulario(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setEnviando(true);
    setErrosCampos({});
    setErroGeral("");

    try {
      const payload: Record<string, unknown> = {};
      const propriedades = schema.properties ?? {};

      for (const [nome, campo] of Object.entries(propriedades)) {
        const valor = dados[nome];
        const obrigatorio = campoObrigatorio(nome);
        if (!campoVisivel(nome)) continue;
        if ((valor === "" || valor === null || valor === undefined) && !obrigatorio) continue;

        const tipo = Array.isArray(campo?.type)
          ? campo.type.find((item) => item !== "null")
          : campo?.type;
        payload[nome] = (tipo === "number" || tipo === "integer") && typeof valor === "string" && valor !== ""
          ? Number(valor)
          : valor;
      }

      await onSubmit(payload, new FormData(evento.currentTarget));
    } catch (error) {
      const erros = extrairErros(error);
      setErrosCampos(erros.campos);
      setErroGeral(erros.geral);
    } finally {
      setEnviando(false);
    }
  }

  function renderizarCampo(
    nome: string,
    campo: JsonSchemaProperty
  ) {
    const configuracao = campos[nome];
    const obrigatorio = campoObrigatorio(nome);
    const tipo = Array.isArray(campo.type)
      ? campo.type.find((item) => item !== "null")
      : campo.type;
    const valor = dados[nome] ?? "";
    const opcoes = configuracao?.options
      ?? campo.enum?.map((opcao) => ({ value: opcao ?? "", label: String(opcao ?? "") }));
    const tipoInput = configuracao?.type
      ?? (opcoes ? "select"
        : tipo === "integer" || tipo === "number" ? "number"
          : campo.format === "date" ? "date"
            : campo.format === "email" ? "email"
              : "text");
    const rotulo = configuracao?.title ?? campo.title ?? nome;
    const erroCampo = errosCampos[nome];
    const idErro = `${nome}-erro`;

    if (tipo === "boolean") {
      return (
        <label className="document-toggle" key={nome}>
          <input
            name={nome}
            type="checkbox"
            checked={Boolean(valor)}
            disabled={configuracao?.disabled}
            aria-invalid={Boolean(erroCampo)}
            aria-describedby={erroCampo ? idErro : undefined}
            onChange={(evento) => atualizarCampo(nome, evento)}
          />
          {" "}{rotulo}
          {obrigatorio ? " *" : ""}
          {erroCampo && <small className="form-field-error" id={idErro} role="alert">{erroCampo}</small>}
        </label>
      );
    }

    return (
      <label key={nome}>
          {rotulo}
          {obrigatorio ? " *" : ""}
        {tipoInput === "select" ? (
          <select
            id={nome}
            name={nome}
            value={String(valor)}
            required={obrigatorio}
            disabled={configuracao?.disabled}
            aria-invalid={Boolean(erroCampo)}
            aria-describedby={erroCampo ? idErro : undefined}
            onChange={(evento) => atualizarCampo(nome, evento)}
          >
            <option value="">Selecione</option>
            {opcoes?.map((opcao) => (
              <option key={String(opcao.value)} value={String(opcao.value)}>
                {opcao.label}
              </option>
            ))}
          </select>
        ) : tipoInput === "textarea" ? (
          <textarea
            id={nome}
            name={nome}
            value={String(valor)}
            required={obrigatorio}
            minLength={configuracao?.minLength ?? campo.minLength}
            maxLength={configuracao?.maxLength ?? campo.maxLength}
            disabled={configuracao?.disabled}
            aria-invalid={Boolean(erroCampo)}
            aria-describedby={erroCampo ? idErro : undefined}
            onChange={(evento) => atualizarCampo(nome, evento)}
          />
        ) : (
          <input
            id={nome}
            name={nome}
            type={tipoInput}
            value={String(valor)}
            required={obrigatorio}
            min={campo.minimum}
            max={campo.maximum}
            minLength={configuracao?.minLength ?? campo.minLength}
            maxLength={configuracao?.maxLength ?? campo.maxLength}
            pattern={campo.pattern}
            placeholder={configuracao?.placeholder}
            inputMode={configuracao?.inputMode}
            autoComplete={configuracao?.type === "password" ? "new-password" : undefined}
            disabled={configuracao?.disabled}
            aria-invalid={Boolean(erroCampo)}
            aria-describedby={erroCampo ? idErro : undefined}
            onChange={(evento) => atualizarCampo(nome, evento)}
          />
        )}
        {erroCampo && tipo !== "boolean" && <small className="form-field-error" id={idErro} role="alert">{erroCampo}</small>}
        {campo.description && <small>{campo.description}</small>}
      </label>
    );
  }

  return (
    <form onSubmit={enviarFormulario}>
      {erroGeral && <p className="form-error" role="alert">{erroGeral}</p>}
      <div className="form-grid">
        {Object.entries(schema.properties ?? {}).filter(([nome]) => campoVisivel(nome)).map(([nome, campo]) =>
          renderizarCampo(nome, campo)
        )}
        {children}
      </div>

      <div className="form-actions">
        {onCancel && <button type="button" className="btn outline" onClick={onCancel} disabled={enviando || desabilitado}>Cancelar</button>}
        <button type="submit" className="btn primary" disabled={enviando || desabilitado}>
          {enviando ? textoSalvando : textoSalvar}
        </button>
      </div>
    </form>
  );
}