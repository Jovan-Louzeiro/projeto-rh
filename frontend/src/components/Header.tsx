import Icon from "./Icon";

export default function Header() {
  return (
    <header className="topbar">
      <div className="mobile-title">RH DIGITAL</div>
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
