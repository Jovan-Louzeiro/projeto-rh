import { Children, isValidElement, useState } from "react";
import type {
  FormEvent,
  ChangeEvent,
  ReactNode,
} from "react";

import type {
  CampoFormularioConfig,
  JsonSchema,
  JsonSchemaProperty,
  SecaoFormularioConfig,
} from "../../types/json-schema.types";

type Props = {
  schema: JsonSchema;
  valoresIniciais?: Record<string, unknown>;
  campos?: Record<string, CampoFormularioConfig>;
  secoes?: SecaoFormularioConfig[];
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
  secoes,
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
    const configuracao = campos[nome];
    if (configuracao?.required !== undefined) return configuracao.required;
    const condicao = configuracao?.requiredWhen;
    if (condicao) {
      return String(dados[condicao.field]) === String(condicao.equals);
    }
    return schema.required?.includes(nome) ?? false;
  }

  function campoDesabilitado(nome: string): boolean {
    const configuracao = campos[nome];
    return Boolean(configuracao?.disabled)
      || Boolean(configuracao?.disabledWhen?.some(condicao =>
        String(dados[condicao.field] ?? "") === String(condicao.equals),
      ));
  }

  function formatarCpf(valor: string): string {
    const numeros = valor.replace(/\D/g, "").slice(0, 11);
    if (numeros.length <= 3) return numeros;
    if (numeros.length <= 6) return `${numeros.slice(0, 3)}.${numeros.slice(3)}`;
    if (numeros.length <= 9) return `${numeros.slice(0, 3)}.${numeros.slice(3, 6)}.${numeros.slice(6)}`;
    return `${numeros.slice(0, 3)}.${numeros.slice(3, 6)}.${numeros.slice(6, 9)}-${numeros.slice(9)}`;
  }

  function gerarCpf(): string {
    let digitos: number[];
    do {
      digitos = Array.from({ length: 9 }, () => Math.floor(Math.random() * 10));
    } while (digitos.every(digito => digito === digitos[0]));

    const calcularDigito = (numeros: number[]) => {
      const soma = numeros.reduce(
        (total, numero, indice) => total + numero * (numeros.length + 1 - indice),
        0,
      );
      const resto = (soma * 10) % 11;
      return resto === 10 ? 0 : resto;
    };

    const primeiroDigito = calcularDigito(digitos);
    const segundoDigito = calcularDigito([...digitos, primeiroDigito]);
    return formatarCpf([...digitos, primeiroDigito, segundoDigito].join(""));
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
        : campos[nome]?.formato === "cpf"
          ? formatarCpf(evento.target.value)
          : evento.target.value;

    setDados((anteriores) => {
      const novosDados = { ...anteriores, [nome]: valor };
      campos[nome]?.setValueWhen?.forEach(definirValor => {
        if (String(valor) === String(definirValor.equals)) {
          novosDados[definirValor.targetField] = definirValor.value;
        }
      });
      return novosDados;
    });
    setErrosCampos((anteriores) => {
      if (!anteriores[nome]) return anteriores;
      const proximos = { ...anteriores };
      delete proximos[nome];
      return proximos;
    });
    setErroGeral("");
  }

  function preencherCpfDeTeste(nome: string) {
    setDados(anteriores => ({ ...anteriores, [nome]: gerarCpf() }));
    setErrosCampos(anteriores => {
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
    const marcadorObrigatorio = obrigatorio
      ? <span className="campo-obrigatorio" aria-label="obrigatório"> *</span>
      : null;
    const campoClassName = configuracao?.tamanho === "compacto" ? "campo-compacto" : undefined;

    if (tipo === "boolean") {
      if (configuracao?.estilo === "toggle") {
        const marcado = Boolean(valor);
        return (
          <label className={`cadastro-switch${campoClassName ? ` ${campoClassName}` : ""}`} key={nome}>
            <span className="cadastro-switch-titulo">{rotulo}{marcadorObrigatorio}</span>
            <input
              name={nome}
              type="checkbox"
              role="switch"
              checked={marcado}
              disabled={campoDesabilitado(nome)}
              aria-checked={marcado}
              aria-invalid={Boolean(erroCampo)}
              aria-describedby={erroCampo ? idErro : undefined}
              onChange={(evento) => atualizarCampo(nome, evento)}
            />
            <span className="cadastro-switch-trilho" aria-hidden="true"><span /></span>
            <span className="cadastro-switch-estado">{marcado ? "Ligado" : "Desligado"}</span>
            {erroCampo && <small className="form-field-error" id={idErro} role="alert">{erroCampo}</small>}
          </label>
        );
      }

      return (
        <label className={`document-toggle${campoClassName ? ` ${campoClassName}` : ""}`} key={nome}>
          <input
            name={nome}
            type="checkbox"
            checked={Boolean(valor)}
            disabled={campoDesabilitado(nome)}
            aria-invalid={Boolean(erroCampo)}
            aria-describedby={erroCampo ? idErro : undefined}
            onChange={(evento) => atualizarCampo(nome, evento)}
          />
          {" "}{rotulo}
          {marcadorObrigatorio}
          {erroCampo && <small className="form-field-error" id={idErro} role="alert">{erroCampo}</small>}
        </label>
      );
    }

    return (
      <label className={campoClassName} key={nome}>
        <span>{rotulo}{marcadorObrigatorio}</span>
        {tipoInput === "select" ? (
          <select
            id={nome}
            name={nome}
            value={String(valor)}
            required={obrigatorio}
            disabled={campoDesabilitado(nome)}
            aria-invalid={Boolean(erroCampo)}
            aria-describedby={erroCampo ? idErro : undefined}
            onChange={(evento) => atualizarCampo(nome, evento)}
          >
            <option value="">--------</option>
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
            disabled={campoDesabilitado(nome)}
            aria-invalid={Boolean(erroCampo)}
            aria-describedby={erroCampo ? idErro : undefined}
            onChange={(evento) => atualizarCampo(nome, evento)}
          />
        ) : (
          configuracao?.formato === "cpf" ? (
            <div className="campo-com-acao">
              <input
                id={nome}
                name={nome}
                type={tipoInput}
                value={String(valor)}
                required={obrigatorio}
                minLength={configuracao?.minLength ?? campo.minLength}
                maxLength={configuracao?.maxLength ?? campo.maxLength}
                pattern={campo.pattern}
                placeholder={configuracao?.placeholder}
                inputMode={configuracao?.inputMode}
                disabled={campoDesabilitado(nome)}
                aria-invalid={Boolean(erroCampo)}
                aria-describedby={erroCampo ? idErro : undefined}
                onChange={(evento) => atualizarCampo(nome, evento)}
              />
              <button
                type="button"
                className="btn outline gerar-cpf"
                onClick={() => preencherCpfDeTeste(nome)}
                disabled={campoDesabilitado(nome) || desabilitado || enviando}
                aria-label={`Gerar CPF de teste para ${rotulo}`}
                title="Gerar CPF válido para testes"
              >
                Gerar CPF
              </button>
            </div>
          ) : (
          <input
            id={nome}
            name={nome}
            type={tipoInput}
            value={String(valor)}
            required={obrigatorio}
            min={configuracao?.minimum ?? campo.minimum}
            max={configuracao?.maximum ?? campo.maximum}
            minLength={configuracao?.minLength ?? campo.minLength}
            maxLength={configuracao?.maxLength ?? campo.maxLength}
            pattern={campo.pattern}
            placeholder={configuracao?.placeholder}
            inputMode={configuracao?.inputMode}
            autoComplete={configuracao?.type === "password" ? "new-password" : undefined}
            disabled={campoDesabilitado(nome)}
            aria-invalid={Boolean(erroCampo)}
            aria-describedby={erroCampo ? idErro : undefined}
            onChange={(evento) => atualizarCampo(nome, evento)}
          />
          )
        )}
        {erroCampo && tipo !== "boolean" && <small className="form-field-error" id={idErro} role="alert">{erroCampo}</small>}
        {campo.description && <small>{campo.description}</small>}
      </label>
    );
  }

  const propriedadesVisiveis = Object.entries(schema.properties ?? {})
    .filter(([nome]) => campoVisivel(nome));
  const camposPorSecao = new Set(secoes?.flatMap(secao =>
    secao.campos.filter((campo): campo is string => typeof campo === "string"),
  ) ?? []);
  const camposSemSecao = propriedadesVisiveis.filter(([nome]) => !camposPorSecao.has(nome));
  const conteudosSecao = new Map<string, ReactNode>();
  const conteudosNaoAssociados: ReactNode[] = [];
  Children.toArray(children).forEach(conteudo => {
    if (isValidElement<{ "data-cadastro-secao"?: string }>(conteudo)
      && conteudo.props["data-cadastro-secao"]) {
      conteudosSecao.set(conteudo.props["data-cadastro-secao"], conteudo);
      return;
    }
    conteudosNaoAssociados.push(conteudo);
  });

  return (
    <form onSubmit={enviarFormulario}>
      {erroGeral && <p className="form-error" role="alert">{erroGeral}</p>}
      <div className={`form-grid${secoes ? " form-grid-secoes" : ""}`}>
        {secoes ? (
          <>
            {secoes.map(secao => {
              const camposDaSecao = secao.campos.some(item =>
                typeof item === "string" && propriedadesVisiveis.some(([nome]) => nome === item),
              );
              const conteudo = secao.conteudo ?? conteudosSecao.get(secao.titulo);
              if (!camposDaSecao && !conteudo) return null;

              return (
                <section className="cadastro-form-section full-col" key={secao.titulo}>
                  <div className="cadastro-form-section-heading">
                    <div>
                      <h2>{secao.titulo}</h2>
                    </div>
                  </div>
                  <div className="form-grid">
                    {secao.campos.map(item => {
                      if (typeof item !== "string") {
                        return (
                          <label className={`campo-visual${item.tamanho === "compacto" ? " campo-compacto" : ""}`} key={item.visual}>
                            {item.visual}
                            <input value="-" readOnly aria-label={`${item.visual}, apenas visual`} />
                          </label>
                        );
                      }

                      const campo = propriedadesVisiveis.find(([nome]) => nome === item);
                      return campo ? renderizarCampo(campo[0], campo[1]) : null;
                    })}
                  </div>
                  {conteudo}
                </section>
              );
            })}
            {camposSemSecao.length > 0 && (
              <section className="cadastro-form-section full-col">
                <div className="cadastro-form-section-heading">
                  <div>
                    <h2>Informações adicionais</h2>
                  </div>
                </div>
                <div className="form-grid">
                  {camposSemSecao.map(([nome, campo]) => renderizarCampo(nome, campo))}
                </div>
              </section>
            )}
          </>
        ) : propriedadesVisiveis.map(([nome, campo]) => renderizarCampo(nome, campo))}
        {conteudosNaoAssociados}
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