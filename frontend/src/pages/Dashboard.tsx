import { useEffect, useState } from "react";
import type { Screen } from "../types";
import MetricCard from "../components/MetricCard";
import { carregarOpcoesServidor, type OpcaoServidor } from "../services/opcoesServidor";
import { contarServidores, listarServidores } from "../services/servidores";
import type { Servidor } from "../types";

type Props = { navigate: (screen: Screen) => void };
type Categoria = { chave: string; descricao: string; quantidade: number; cor: string };
type Registro = Record<string, unknown>;

const cores = ["#0aa15a", "#4285e9", "#f6a21a", "#8a65d8", "#d95368", "#16a6a1", "#9b6b4b", "#a0aaa5"];
const numeroPtBr = new Intl.NumberFormat("pt-BR");
const percentualPtBr = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 1 });
const coresGenero = {
  feminino: "#e85d9e",
  masculino: "#4388e8",
  naoBinario: "#8866d9",
  outro: "#f0a43a",
  naoInformado: "#9aa6a0",
};

function idOpcao(valor: unknown): string | null {
  return typeof valor === "string" || typeof valor === "number" ? String(valor) : null;
}

function corGenero(descricao: string): string | undefined {
  const normalizada = descricao.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("pt-BR");
  if (normalizada.includes("fem") || normalizada.includes("mulher")) return coresGenero.feminino;
  if (normalizada.includes("masc") || normalizada.includes("homem")) return coresGenero.masculino;
  if (normalizada.includes("nao informado") || normalizada.includes("prefiro nao")) return coresGenero.naoInformado;
  if (normalizada.includes("nao binar") || normalizada.includes("binari")) return coresGenero.naoBinario;
  if (normalizada.includes("outro")) return coresGenero.outro;
  return undefined;
}

function agrupar(
  servidores: Servidor[],
  obterId: (servidor: Servidor) => unknown,
  opcoes: OpcaoServidor[],
  obterCor?: (descricao: string) => string | undefined,
): Categoria[] {
  const descricoes = new Map(opcoes.map(opcao => [String(opcao.id), opcao.descricao]));
  const contagens = new Map<string, number>();

  for (const servidor of servidores) {
    const chave = idOpcao(obterId(servidor)) ?? "nao-informado";
    contagens.set(chave, (contagens.get(chave) ?? 0) + 1);
  }

  return [...contagens.entries()]
    .map(([chave, quantidade], indice) => ({
      chave,
      descricao: chave === "nao-informado" ? "Não informado" : descricoes.get(chave) ?? `ID ${chave}`,
      quantidade,
      cor: obterCor?.(chave === "nao-informado" ? "Não informado" : descricoes.get(chave) ?? `ID ${chave}`)
        ?? cores[indice % cores.length],
    }))
    .sort((a, b) => b.quantidade - a.quantidade || a.descricao.localeCompare(b.descricao, "pt-BR"));
}

function Distribuicao({ titulo, itens, total }: { titulo: string; itens: Categoria[]; total: number }) {
  const [realce, setRealce] = useState<string | null>(null);
  const circunferencia = 2 * Math.PI * 56;
  let quantidadeAcumulada = 0;
  const segmentos = itens.map(item => {
    const inicio = quantidadeAcumulada;
    quantidadeAcumulada += item.quantidade;
    return { ...item, inicio, percentual: total ? item.quantidade / total : 0 };
  });
  const ativo = segmentos.find(item => item.chave === realce);

  return (
    <section className="card dashboard-distribuicao" aria-label={`Distribuição por ${titulo}`}>
      <h2 className="section-title">{titulo}</h2>
      {total === 0 ? (
        <p className="muted">Não há servidores para exibir.</p>
      ) : (
        <>
          <div className="chart-wrap">
            <div className="dashboard-chart">
              <svg
                className="dashboard-donut"
                viewBox="0 0 160 160"
                role="img"
                aria-label={`Distribuição de ${titulo.toLocaleLowerCase()} entre ${numeroPtBr.format(total)} servidores`}
                onMouseLeave={() => setRealce(null)}
              >
                {segmentos.map(item => (
                  <circle
                    key={item.chave}
                    className="dashboard-donut-segment"
                    cx="80"
                    cy="80"
                    r="56"
                    fill="none"
                    stroke={item.cor}
                    strokeWidth={realce === item.chave ? 30 : 24}
                    strokeDasharray={`${circunferencia * item.percentual} ${circunferencia}`}
                    strokeDashoffset={-circunferencia * item.inicio / total}
                    transform="rotate(-90 80 80)"
                    opacity={realce && realce !== item.chave ? 0.35 : 1}
                    tabIndex={0}
                    role="graphics-symbol"
                    aria-label={`${item.descricao}: ${numeroPtBr.format(item.quantidade)} servidores, ${percentualPtBr.format(item.percentual * 100)}%`}
                    onMouseEnter={() => setRealce(item.chave)}
                    onFocus={() => setRealce(item.chave)}
                    onBlur={() => setRealce(null)}
                  >
                    <title>{`${item.descricao}: ${numeroPtBr.format(item.quantidade)} (${percentualPtBr.format(item.percentual * 100)}%)`}</title>
                  </circle>
                ))}
              </svg>
              <span className="dashboard-donut-center">{numeroPtBr.format(total)}</span>
            </div>
            <div className="legend" role="list" aria-label={`Legenda: ${titulo}`}>
              {segmentos.map(item => (
                <div
                  className={`legend-row dashboard-legend-row${realce === item.chave ? " is-active" : ""}`}
                  key={item.chave}
                  role="listitem"
                  tabIndex={0}
                  onMouseEnter={() => setRealce(item.chave)}
                  onMouseLeave={() => setRealce(null)}
                  onFocus={() => setRealce(item.chave)}
                  onBlur={() => setRealce(null)}
                >
                  <span><i className="dot" style={{ backgroundColor: item.cor }} />{item.descricao}</span>
                  <strong>
                    {percentualPtBr.format(item.percentual * 100)}%
                    <small>{numeroPtBr.format(item.quantidade)}</small>
                  </strong>
                </div>
              ))}
            </div>
          </div>
          <p className="dashboard-chart-tooltip" aria-live="polite">
            {ativo
              ? `${ativo.descricao}: ${numeroPtBr.format(ativo.quantidade)} servidores (${percentualPtBr.format(ativo.percentual * 100)}%)`
              : "Passe o mouse ou foque uma categoria para ver os detalhes."}
          </p>
        </>
      )}
    </section>
  );
}

export default function Dashboard({ navigate }: Props) {
  const [servidoresNaoExcluidos, setServidoresNaoExcluidos] = useState<number | null>(null);
  const [servidores, setServidores] = useState<Servidor[]>([]);
  const [opcoes, setOpcoes] = useState<Awaited<ReturnType<typeof carregarOpcoesServidor>> | null>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    async function carregarDashboard() {
      try {
        const [ativos, lista, opcoesServidor] = await Promise.all([
          contarServidores({ ativo: "true" }, controller.signal),
          listarServidores(controller.signal, {
            servidorSelect: ["id_servidor", "ativo", "situacao_id", "genero_id", "racacor_id"],
            matriculasSelect: ["ativo", "tipo_vinculo_id"],
            historicosFuncionaisSelect: [],
          }),
          carregarOpcoesServidor(controller.signal),
        ]);
        const servidoresNaoExcluidos = lista.filter(servidor => servidor.ativo !== false);
        setServidoresNaoExcluidos(ativos);
        setServidores(servidoresNaoExcluidos);
        setOpcoes(opcoesServidor);
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error(error);
          setErro(error instanceof Error ? error.message : "Não foi possível carregar o resumo de servidores.");
          setServidoresNaoExcluidos(null);
          setServidores([]);
          setOpcoes(null);
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    void carregarDashboard();
    return () => controller.abort();
  }, []);

  const vinculos = agrupar(servidores, servidor => {
    const matriculas = Array.isArray(servidor.matriculas)
      ? servidor.matriculas as Registro[]
      : [];
    const matricula = matriculas.find(item => item.ativo === true) ?? matriculas[0];
    return matricula?.tipo_vinculo_id;
  }, opcoes?.tiposVinculo ?? []);
  const descricaoSituacao = (servidor: Servidor) =>
    opcoes?.situacoes.find(opcao => String(opcao.id) === String(servidor.situacao_id))?.descricao
      ?? servidor.status;
  const servidoresComSituacaoAtiva = servidores.filter(servidor =>
    descricaoSituacao(servidor).trim().toLocaleLowerCase("pt-BR") === "ativo",
  ).length;
  const servidoresEmOutrasSituacoes = servidores.length - servidoresComSituacaoAtiva;

  return (
    <div className="page dashboard-page">
      <div className="page-head">
        <div><h1>Dashboard</h1><p>Resumo geral do RH.</p></div>
      </div>
      {erro && <p className="form-error" role="alert">{erro}</p>}
      <div className="cards dashboard-cards">
        <MetricCard
          icon="users"
          value={loading || erro ? "—" : numeroPtBr.format(servidoresNaoExcluidos ?? 0)}
          label="Servidores ativos"
          onClick={() => navigate("servidores")}
        />
        <MetricCard
          icon="user-check"
          value={loading ? "—" : numeroPtBr.format(servidoresComSituacaoAtiva)}
          label="Situação funcional: Ativo"
          onClick={() => navigate("servidores")}
        />
        <MetricCard
          icon="users"
          value={loading ? "—" : numeroPtBr.format(servidoresEmOutrasSituacoes)}
          label="Outras situações funcionais"
          onClick={() => navigate("servidores")}
        />
      </div>
      <div className="dashboard-visao-geral">
        <h2 className="section-title">Visão geral</h2>
        <div className="dashboard-graficos">
          <Distribuicao
            titulo="Situação funcional"
            itens={agrupar(servidores, servidor => servidor.situacao_id, opcoes?.situacoes ?? [])}
            total={servidores.length}
          />
          <Distribuicao
            titulo="Gênero"
            itens={agrupar(servidores, servidor => servidor.genero_id, opcoes?.generos ?? [], corGenero)}
            total={servidores.length}
          />
          <Distribuicao
            titulo="Raça / cor"
            itens={agrupar(servidores, servidor => servidor.racacor_id, opcoes?.racasCor ?? [])}
            total={servidores.length}
          />
          <Distribuicao titulo="Tipo de vínculo" itens={vinculos} total={servidores.length} />
        </div>
      </div>
    </div>
  );
}
