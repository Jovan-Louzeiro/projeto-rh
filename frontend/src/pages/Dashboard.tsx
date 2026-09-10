import { useEffect, useState } from "react";
import type { Screen } from "../types";
import MetricCard from "../components/MetricCard";
import { listar } from "../services/api";
type Summary = { servidoresAtivos?: number; contratosAtivos?: number; feriasPendentes?: number; solicitacoesPendentes?: number; proximosQuinquenios?: number };
type Props = { navigate: (screen: Screen) => void };
export default function Dashboard({ navigate }: Props) {
  const [data, setData] = useState<Summary>({}); const [loading, setLoading] = useState(true);
  useEffect(() => { const c = new AbortController(); listar<Summary>("dashboard", c.signal).then(items => setData(items[0] ?? {})).catch(() => {}).finally(() => setLoading(false)); return () => c.abort(); }, []);
  const value = (number?: number) => loading ? "—" : String(number ?? 0);
  return <><div className="page-head"><div><h1>Dashboard</h1><p>Resumo geral do RH.</p></div></div><div className="cards"><MetricCard icon="users" value={value(data.servidoresAtivos)} label="Servidores Ativos" onClick={() => navigate("servidores")} /><MetricCard icon="file" value={value(data.contratosAtivos)} label="Contratos Ativos" onClick={() => navigate("contratos")} /><MetricCard icon="calendar-days" value={value(data.feriasPendentes)} label="Férias Pendentes" onClick={() => navigate("ferias")} /><MetricCard icon="clipboard-list" value={value(data.solicitacoesPendentes)} label="Solicitações Pendentes" onClick={() => navigate("solicitacoes")} /><MetricCard icon="trophy" value={value(data.proximosQuinquenios)} label="Próx. Quinquênios" onClick={() => navigate("quinquenios")} /></div><div className="card"><h3 className="section-title">Visão geral</h3><p className="muted">Os indicadores serão atualizados quando a API do dashboard estiver conectada.</p></div></>;
}
