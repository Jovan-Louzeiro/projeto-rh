import { NavLink } from "react-router-dom";
import Icon from "./Icon";
import PrefeituraLogo from "./PrefeituraLogo";

const items = [
  { path: "/dashboard", label: "Dashboard", icon: "home" }, { path: "/servidores", label: "Servidores", icon: "users" }, { path: "/ferias", label: "Férias", icon: "calendar-days" }, { path: "/licencas", label: "Licenças", icon: "file-medical" }, { path: "/contratos", label: "Contratos", icon: "briefcase" }, { path: "/quinquenios", label: "Quinquênios", icon: "trophy" }, { path: "/solicitacoes", label: "Solicitações", icon: "envelope" }, { path: "/requerimentos", label: "Requerimentos", icon: "document-signed" }, { path: "/documentos", label: "Documentos", icon: "folder" }, { path: "/relatorios", label: "Relatórios", icon: "chart-histogram" }, { path: "/cadastros", label: "Cadastros", icon: "list" }, { path: "/configuracoes", label: "Configurações", icon: "settings" },
];
type SidebarProps = {
  collapsed: boolean;
  onToggleCollapsed: () => void;
  open?: boolean;
  onClose?: () => void;
};

export default function Sidebar({ collapsed, onToggleCollapsed, open = false, onClose }: SidebarProps) {
  return <>
    <button className={`sidebar-backdrop ${open ? "visible" : ""}`} aria-label="Fechar menu" tabIndex={open ? 0 : -1} onClick={onClose} />
    <aside id="main-navigation" className={`sidebar ${open ? "sidebar-open" : ""}`}>
      <div className="brand">
        <div className="brand-logo"><PrefeituraLogo /></div>
        <div className="brand-name"><strong>RH DIGITAL</strong><span>Carutapera - MA</span></div>
        <button className="sidebar-collapse-toggle" type="button" aria-label={collapsed ? "Expandir barra lateral" : "Recolher barra lateral"} title={collapsed ? "Expandir barra lateral" : "Recolher barra lateral"} aria-pressed={collapsed} onClick={onToggleCollapsed}>
          <Icon name={collapsed ? "angle-double-right" : "angle-double-left"} />
        </button>
      </div>
      <nav className="sidebar-nav">{items.map(item => <NavLink key={item.path} to={item.path} title={collapsed ? item.label : undefined} aria-label={collapsed ? item.label : undefined} onClick={onClose} className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}><Icon name={item.icon} /><span>{item.label}</span></NavLink>)}</nav>
      <div className="help-box"><strong>Precisa de ajuda?</strong><p>Fale com o suporte do sistema.</p><button className="btn outline full"><Icon name="headset" /> Abrir chamado</button><a href="https://www.flaticon.com/uicons" target="_blank" rel="noreferrer" className="flaticon-credit">Uicons by Flaticon</a></div>
      <div className="user-mini"><div className="avatar">MS</div><div><strong>Maria Santos</strong><span>Analista de RH</span></div></div>
    </aside>
  </>;
}
