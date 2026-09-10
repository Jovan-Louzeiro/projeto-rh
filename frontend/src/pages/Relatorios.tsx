import Icon from "../components/Icon";
import { relatorios } from "./relatoriosConfig";
import type { RelatorioTipo } from "../services/relatorios";
type Props = { onConfigurar: (tipo: RelatorioTipo) => void };
export default function Relatorios({ onConfigurar }: Props) { return <><div className="page-head"><div><h1>Relatórios</h1><p>Gere relatórios para acompanhamento e gestão do RH.</p></div></div><div className="report-grid">{relatorios.map(r => <div className="card report-card" key={r.tipo}><div className="report-icon"><Icon name={r.icone} /></div><h3>{r.titulo}</h3><p>{r.descricao}</p><button className="btn primary" onClick={() => onConfigurar(r.tipo)}>Gerar relatório</button></div>)}</div></>; }
