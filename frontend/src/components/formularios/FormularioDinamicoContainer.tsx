import type { ReactNode } from "react";
import { useEffect, useState } from "react";

import { buscarSchema } from "../../services/schemas.service";
import { FormularioDinamico } from "./FormularioDinamico";

import type {
  CampoFormularioConfig,
  JsonSchema,
  OperacaoFormulario,
  SecaoFormularioConfig,
} from "../../types/json-schema.types";

type Props = {
  dominio: string;
  idServidor?: string | number;
  operacao: OperacaoFormulario;
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

export function FormularioDinamicoContainer({
  dominio,
  idServidor,
  operacao,
  valoresIniciais,
  campos,
  secoes,
  textoSalvar,
  textoSalvando,
  desabilitado,
  onCancel,
  children,
  onSubmit,
}: Props) {
  const [schema, setSchema] = useState<JsonSchema | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    let cancelado = false;

    async function carregarSchema() {
      setCarregando(true);
      setErro(null);
      setSchema(null);

      try {
        const resposta = await buscarSchema(dominio, operacao, idServidor);

        if (!cancelado) {
          setSchema(resposta.schema);
        }
      } catch (erro) {
        if (!cancelado) {
          setErro(
            erro instanceof Error
              ? erro.message
              : "Não foi possível carregar o formulário."
          );
        }
      } finally {
        if (!cancelado) {
          setCarregando(false);
        }
      }
    }

    void carregarSchema();

    return () => {
      cancelado = true;
    };
  }, [dominio, idServidor, operacao]);

  if (carregando) {
    return <p>Carregando formulário...</p>;
  }

  if (erro || !schema) {
    return <p role="alert">{erro ?? "Schema não encontrado."}</p>;
  }

  return (
    <FormularioDinamico
      key={`${dominio}-${operacao}`}
      schema={schema}
      valoresIniciais={valoresIniciais}
      campos={campos}
      secoes={secoes}
      textoSalvar={textoSalvar}
      textoSalvando={textoSalvando}
      desabilitado={desabilitado}
      onCancel={onCancel}
      children={children}
      onSubmit={onSubmit}
    />
  );
}