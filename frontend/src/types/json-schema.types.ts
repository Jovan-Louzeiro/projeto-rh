import type { ReactNode } from "react";

export type JsonSchemaProperty = {
  type?: string | string[];
  title?: string;
  description?: string;
  format?: string;
  enum?: (string | number | boolean | null)[];
  const?: string | number | boolean | null;
  default?: unknown;
  minimum?: number;
  maximum?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  properties?: Record<string, JsonSchemaProperty>;
  items?: JsonSchemaProperty;
  required?: string[];
  anyOf?: JsonSchemaProperty[];
  oneOf?: JsonSchemaProperty[];
};

export type JsonSchema = {
  $schema?: string;
  type?: string | string[];
  title?: string;
  description?: string;
  properties?: Record<string, JsonSchemaProperty>;
  required?: string[];
  additionalProperties?: boolean;
};

export type OperacaoFormulario = "adicionar" | "atualizar";

export type SchemaFormularioResponse = {
  operacao: OperacaoFormulario;
  schema: JsonSchema;
};

export type CampoFormularioConfig = {
  title?: string;
  required?: boolean;
  type?: "text" | "email" | "password" | "number" | "date" | "select" | "textarea" | "boolean";
  options?: { value: string | number | boolean; label: string }[];
  defaultValue?: unknown;
  placeholder?: string;
  inputMode?: "text" | "numeric" | "decimal" | "tel" | "search" | "email" | "url";
  minLength?: number;
  maxLength?: number;
  minimum?: number;
  maximum?: number;
  hidden?: boolean;
  disabled?: boolean;
  disabledWhen?: { field: string; equals: unknown }[];
  formato?: "cpf";
  estilo?: "toggle";
  setValueWhen?: { equals: unknown; targetField: string; value: unknown }[];
  tamanho?: "compacto";
  visibleWhen?: { field: string; equals: unknown };
  requiredWhen?: { field: string; equals: unknown };
};

export type SecaoFormularioConfig = {
  titulo: string;
  campos: (string | { visual: string; tamanho?: "compacto" })[];
  conteudo?: ReactNode;
};
