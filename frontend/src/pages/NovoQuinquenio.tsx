import { useEffect, useMemo, useState } from "react";
import type { Quinquenio, Servidor } from "../types";
import {
  atualizarQuinquenio,
  buscarQuinquenio,
  calcularSituacaoQuinquenio,
  cadastrarQuinquenio,
  type CamposQuinquenio,
  type DadosQuinquenio,
} from "../services/quinquenios";
import { listarServidores } from "../services/servidores";
import Icon from "../components/Icon";

type Props = { onBack: () => void; id?: string; servidorIdInicial?: string };
type Form = Omit<
  Quinquenio,
  | "id"
  | "servidor"
  | "matricula"
  | "cargo"
  | "secretaria"
  | "dataAdmissao"
  | "periodoAquisitivoInicio"
  | "periodoAquisitivoFim"
  | "dataAquisicao"
  | "valorCalculado"
  | "atoDocumento"
  | "situacao"
>;

const inicial: Form = {
  servidorId: "",
  numero: 1,
  percentualAdicional: 0,
  dataInicioPagamento: "",
  atoNumero: "",
  atoTipo: "",
  atoData: "",
  observacoes: "",
};

export default function NovoQuinquenio({ onBack, id, servidorIdInicial }: Props) {
  const [form, setForm] = useState<Form>(() => ({ ...inicial, servidorId: servidorIdInicial ?? "" }));
  const [servidores, setServidores] = useState<Servidor[]>([]);
  const [baseCalculo, setBaseCalculo] = useState(0);
  const [documento, setDocumento] = useState<File>();
  const [documentoAtual, setDocumentoAtual] = useState("");
  const [dataAdmissaoRegistro, setDataAdmissaoRegistro] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    async function carregarDados() {
      setCarregando(true);
      try {
        const [lista, registro] = await Promise.all([
          listarServidores(controller.signal),
          id ? buscarQuinquenio(id, controller.signal) : Promise.resolve(null),
        ]);
        if (controller.signal.aborted) return;
        setServidores(lista);
        if (registro) {
          setForm({
            servidorId: registro.servidorId,
            numero: registro.numero,
            percentualAdicional: registro.percentualAdicional,
            dataInicioPagamento: registro.dataInicioPagamento,
            atoNumero: registro.atoNumero,
            atoTipo: registro.atoTipo,
            atoData: registro.atoData,
            observacoes: registro.observacoes,
          });
          setDataAdmissaoRegistro(registro.dataAdmissao);
          setDocumentoAtual(registro.atoDocumento ?? "");
          setBaseCalculo(registro.percentualAdicional > 0
            ? registro.valorCalculado * 100 / registro.percentualAdicional
            : 0);
        } else {
          setForm({ ...inicial, servidorId: servidorIdInicial ?? "" });
        }
      } catch (error: unknown) {
        if (!controller.signal.aborted) {
          console.error("[NovoQuinquenio] Erro ao carregar formulário:", error);
          setErro(error instanceof Error ? error.message : "Não foi possível carregar os dados do quinquênio.");
        }
      } finally {
        if (!controller.signal.aborted) setCarregando(false);
      }
    }
    void carregarDados();
    return () => controller.abort();
  }, [id, servidorIdInicial]);

  const servidor = useMemo(
    () => servidores.find((item) => item.id === form.servidorId),
    [servidores, form.servidorId],
  );
  const admissao = dataAdmissaoRegistro || servidor?.dataAdmissao || "";
  const datas = calcularDatas(admissao, form.numero);
  const valor = baseCalculo * form.percentualAdicional / 100;
  const situacao = calcularSituacaoQuinquenio({
    dataAquisicao: datas.aquisicao,
    dataInicioPagamento: form.dataInicioPagamento,
    situacao: "Aguardando concessão",
  });

  const atualizar = <K extends keyof Form>(campo: K, valor: Form[K]) => {
    setForm((atual) => ({ ...atual, [campo]: valor }));
  };

  async function salvar() {
    if ((!servidor && !id) || !admissao || !form.dataInicioPagamento || !form.atoNumero || !form.atoTipo || !form.atoData) {
      setErro("Preencha todos os campos obrigatórios, incluindo a data de admissão do servidor.");
      return;
    }
    if (form.numero < 1 || form.percentualAdicional < 0 || baseCalculo < 0) {
      setErro("Informe valores válidos para o quinquênio, percentual e base de cálculo.");
      return;
    }
    if (form.dataInicioPagamento < datas.aquisicao) {
      setErro("O início do pagamento não pode ser anterior à data de aquisição.");
      return;
    }

    setSalvando(true);
    setErro("");
    try {
      const campos: CamposQuinquenio = {
        numero: form.numero,
        percentualAdicional: form.percentualAdicional,
        valorCalculado: valor,
        dataInicioPagamento: form.dataInicioPagamento,
        atoNumero: form.atoNumero,
        atoTipo: form.atoTipo,
        atoData: form.atoData,
        observacoes: form.observacoes,
      };
      if (id) {
        await atualizarQuinquenio(id, campos, documento);
      } else {
        const dados: DadosQuinquenio = { ...campos, servidorId: form.servidorId };
        await cadastrarQuinquenio(dados, documento);
      }
      onBack();
    } catch (error) {
      console.error("[NovoQuinquenio] Erro ao salvar:", error);
      setErro(error instanceof Error ? error.message : "Não foi possível salvar o quinquênio.");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <>
      <div className="page-head">
        <div><h1>{id ? "Editar Quinquênio" : "Novo Registro de Quinquênio"}</h1><p>{id ? "Atualize os dados do adicional por tempo de serviço." : "Cadastre o adicional por tempo de serviço."}</p></div>
        <button className="btn outline" onClick={onBack}><Icon name="arrow-left" /> Voltar</button>
      </div>
      <div className="card cadastro-servidor">
        <div className="form-grid ferias-form">
          <label className="full-col">
            Servidor
            <select disabled={Boolean(id || servidorIdInicial)} value={form.servidorId} onChange={(event) => atualizar("servidorId", event.target.value)}>
              <option value="">Selecione o servidor</option>
              {servidores.map((item) => <option key={item.id} value={item.id}>{item.nome}</option>)}
            </select>
          </label>
          <Info label="Matrícula" value={servidor?.matricula} />
          <Info label="Cargo" value={servidor?.cargo} />
          <Info label="Secretaria" value={servidor?.secretaria} />
          <Info label="Data de admissão" value={formatar(admissao)} />
          <Campo label="Número do quinquênio" type="number" value={String(form.numero)} onChange={(value) => atualizar("numero", Number(value))} />
          <Info label="Referência" value={form.numero > 0 ? `${form.numero}º (${form.numero * 5} anos)` : "—"} />
          <Info label="Período aquisitivo" value={datas.inicio ? `${formatar(datas.inicio)} a ${formatar(datas.fim)}` : "—"} />
          <Info label="Data de aquisição" value={formatar(datas.aquisicao)} />
          <Campo label="Percentual do adicional" type="number" value={String(form.percentualAdicional)} onChange={(value) => atualizar("percentualAdicional", Number(value))} />
          <Campo label="Base de cálculo" type="number" value={String(baseCalculo)} onChange={(value) => setBaseCalculo(Number(value))} />
          <Info label="Valor calculado" value={valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })} />
          <Campo label="Data de início do pagamento" type="date" value={form.dataInicioPagamento} onChange={(value) => atualizar("dataInicioPagamento", value)} />
          <Info label="Situação calculada" value={situacao} />
          <Campo label="Número do ato administrativo" value={form.atoNumero} onChange={(value) => atualizar("atoNumero", value)} />
          <Campo label="Tipo do ato administrativo" value={form.atoTipo} onChange={(value) => atualizar("atoTipo", value)} />
          <Campo label="Data do ato administrativo" type="date" value={form.atoData} onChange={(value) => atualizar("atoData", value)} />
          <label>
            Upload do ato administrativo
            {documentoAtual && !documento && <span>Documento atual: {documentoAtual}</span>}
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
              onChange={(event) => {
                const arquivo = event.target.files?.[0];
                if (arquivo && arquivo.size > 10 * 1024 * 1024) {
                  setErro("O ato administrativo não pode ultrapassar 10 MB.");
                  event.target.value = "";
                  setDocumento(undefined);
                  return;
                }
                if (arquivo && !["application/pdf", "image/jpeg", "image/png"].includes(arquivo.type)) {
                  setErro("O ato administrativo deve ser PDF, JPG ou PNG.");
                  event.target.value = "";
                  setDocumento(undefined);
                  return;
                }
                setErro("");
                setDocumento(arquivo);
              }}
            />
          </label>
          <label className="full-col">
            Observações
            <textarea value={form.observacoes} onChange={(event) => atualizar("observacoes", event.target.value)} placeholder="Observações adicionais" />
          </label>
        </div>
        {erro && <p className="form-error">{erro}</p>}
        <div className="form-actions">
          <button className="btn outline" onClick={onBack}>Cancelar</button>
          <button className="btn primary" onClick={salvar} disabled={salvando || carregando}>{salvando ? "Salvando..." : id ? "Salvar alterações" : "Salvar quinquênio"}</button>
        </div>
      </div>
    </>
  );
}

function Info({ label, value }: { label: string; value?: string }) {
  return <label>{label}<input value={value ?? "—"} readOnly /></label>;
}

function Campo({
  label,
  type = "text",
  value,
  onChange,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return <label>{label}<input type={type} value={value} onChange={(event) => onChange(event.target.value)} required /></label>;
}

function calcularDatas(admissao: string, numero: number) {
  if (!admissao || numero < 1) return { inicio: "", fim: "", aquisicao: "" };
  const inicio = new Date(`${admissao}T00:00:00.000Z`);
  inicio.setUTCFullYear(inicio.getUTCFullYear() + (numero - 1) * 5);
  const aquisicao = new Date(`${admissao}T00:00:00.000Z`);
  aquisicao.setUTCFullYear(aquisicao.getUTCFullYear() + numero * 5);
  const fim = new Date(aquisicao);
  fim.setUTCDate(fim.getUTCDate() - 1);
  return { inicio: iso(inicio), fim: iso(fim), aquisicao: iso(aquisicao) };
}

function iso(data: Date) {
  return data.toISOString().slice(0, 10);
}

function formatar(data: string) {
  return data ? data.split("-").reverse().join("/") : "—";
}
