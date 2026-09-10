import Icon from "./Icon";

type Props = { icon: string; value: string; label: string; onClick?: () => void };

export default function MetricCard({ icon, value, label, onClick }: Props) {
  return (
    <div className="card metric-card">
      <div className="metric">
        <div className="metric-icon"><Icon name={icon} /></div>
        <div><strong>{value}</strong><span>{label}</span></div>
      </div>
      <button className="metric-link" onClick={onClick}>Ver todos <Icon name="arrow-small-right" /></button>
    </div>
  );
}
