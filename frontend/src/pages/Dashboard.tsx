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

function idOpcao(valor: unknown): string | null {
  return typeof valor === "string" || typeof valor === "number" ? String(valor) : null;
}

function agrupar(
  servidores: Servidor[],
  obterId: (servidor: Servidor) => unknown,
  opcoes: OpcaoServidor[],
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
      cor: cores[indice % cores.length],
    }))
    .sort((a, b) => b.quantidade - a.quantidade || a.descricao.localeCompare(b.descricao, "pt-BR"));
}

function Distribuicao({ titulo, itens, total }: { titulo: string; itens: Categoria[]; total: number }) {
  let percentualAcumulado = 0;
  const segmentos = itens.map(item => {
    const inicio = percentualAcumulado;
    percentualAcumulado += total ? (item.quantidade / total) * 100 : 0;
    return `${item.cor} ${inicio}% ${percentualAcumulado}%`;
  });
  const gradiente = total ? `conic-gradient(${segmentos.join(", ")})` : "#e7eee9";

  return (
    <section className="card dashboard-distribuicao" aria-label={`Distribuição por ${titulo}`}>
      <h2 className="section-title">{titulo}</h2>
      {total === 0 ? (
        <p className="muted">Não há servidores para exibir.</p>
      ) : (
        <div className="chart-wrap">
          <div
            className="donut dashboard-donut"
            role="img"
            aria-label={`Distribuição de ${titulo.toLocaleLowerCase()} entre ${numeroPtBr.format(total)} servidores`}
            style={{ background: gradiente }}
          >
            <span className="donut-center">{numeroPtBr.format(total)}</span>
          </div>
          <div className="legend">
            {itens.map(item => (
              <div className="legend-row dashboard-legend-row" key={item.chave}>
                <span><i className="dot" style={{ backgroundColor: item.cor }} />{item.descricao}</span>
                <strong>
                  {percentualPtBr.format((item.quantidade / total) * 100)}%
                  <small>{numeroPtBr.format(item.quantidade)}</small>
                </strong>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

export default function Dashboard({ navigate }: Props) {
  const [servidoresAtivos, setServidoresAtivos] = useState<number | null>(null);
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
            servidorSelect: ["id_servidor", "genero_id", "racacor_id"],
            matriculasSelect: ["ativo", "tipo_vinculo_id"],
            historicosFuncionaisSelect: [],
          }),
          carregarOpcoesServidor(controller.signal),
        ]);
        setServidoresAtivos(ativos);
        setServidores(lista);
        setOpcoes(opcoesServidor);
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error(error);
          setErro(error instanceof Error ? error.message : "Não foi possível carregar o dashboard.");
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

  return (
    <div className="page dashboard-page">
      <div className="page-head">
        <div><h1>Dashboard</h1><p>Resumo geral do RH.</p></div>
      </div>
      {erro && <div className="form-error" role="alert">{erro}</div>}
      <div className="cards dashboard-cards">
        <MetricCard
          icon="users"
          value={loading ? "—" : numeroPtBr.format(servidoresAtivos ?? 0)}
          label="Servidores Ativos"
          onClick={() => navigate("servidores")}
        />
      </div>
      <div className="dashboard-visao-geral">
        <h2 className="section-title">Visão geral</h2>
        <div className="dashboard-graficos">
          <Distribuicao
            titulo="Gênero"
            itens={agrupar(servidores, servidor => servidor.genero_id, opcoes?.generos ?? [])}
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
