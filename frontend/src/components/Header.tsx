import Icon from "./Icon";

type Props = { onMenuToggle: () => void; menuOpen: boolean };

export default function Header({ onMenuToggle, menuOpen }: Props) {
  return (
    <header className="topbar">
      <div className="mobile-title">RH DIGITAL</div>
      <button className="menu-toggle" type="button" aria-label={menuOpen ? "Fechar menu" : "Abrir menu"} aria-expanded={menuOpen} aria-controls="main-navigation" onClick={onMenuToggle}><Icon name={menuOpen ? "cross" : "bars"} /></button>
      <div className="search">
        <Icon name="search" />
        <input placeholder="Buscar algo..." />
      </div>
      <div className="top-actions">
        <button className="top-icon"><Icon name="bell" /></button>
        <button className="top-icon"><Icon name="interrogation" /></button>
        <div className="user-top">
          <div className="avatar">MS</div>
          <span>Matheus silva Duarte</span>
          <Icon name="angle-small-down" />
        </div>
      </div>
    </header>
  );
}
