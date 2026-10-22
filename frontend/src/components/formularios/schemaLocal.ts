import type {
  CampoFormularioConfig,
  JsonSchema,
  JsonSchemaProperty,
  OperacaoFormulario,
} from "../../types/json-schema.types";

export function criarSchemaLocal(
  campos: Record<string, CampoFormularioConfig>,
  operacao: OperacaoFormulario,
  obrigatorios: string[] = [],
): JsonSchema {
  const properties: Record<string, JsonSchemaProperty> = {};

  for (const [nome, configuracao] of Object.entries(campos)) {
    if (configuracao.hidden) continue;

    const tipo = configuracao.estilo === "toggle" || configuracao.type === "boolean"
      ? "boolean"
      : configuracao.type === "number"
        ? "number"
        : configuracao.type === "select"
          ? "integer"
          : "string";
    properties[nome] = {
      type: tipo,
      title: configuracao.title ?? nome,
      ...(configuracao.type === "date" ? { format: "date" } : {}),
      ...(configuracao.minLength !== undefined ? { minLength: configuracao.minLength } : {}),
      ...(configuracao.maxLength !== undefined ? { maxLength: configuracao.maxLength } : {}),
      ...(configuracao.minimum !== undefined ? { minimum: configuracao.minimum } : {}),
      ...(configuracao.maximum !== undefined ? { maximum: configuracao.maximum } : {}),
    };
  }

  return {
    type: "object",
    properties,
    required: operacao === "adicionar" ? obrigatorios : [],
  };
}
