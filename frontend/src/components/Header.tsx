import Icon from "./Icon";
import { getCurrentUserInfo, getCurrentUserName } from "../services/api";

type Props = { onMenuToggle: () => void; menuOpen: boolean };

export default function Header({ onMenuToggle, menuOpen }: Props) {
  const userName = getCurrentUserName() ?? "Usuário";
  const userInfo = getCurrentUserInfo();
  const initials = userName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toLocaleUpperCase("pt-BR");

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
        <details className="user-profile">
          <summary className="user-top" aria-label="Ver informações do perfil">
            <div className="avatar">{initials}</div>
            <span>{userName}</span>
            <Icon name="angle-small-down" />
          </summary>
          <section className="user-profile-panel" aria-label="Informações do perfil">
            <div className="user-profile-heading">
              <div className="avatar">{initials}</div>
              <div>
                <strong>{userName}</strong>
                <span>Perfil da conta</span>
              </div>
            </div>
            <dl>
              {userInfo?.id !== null && userInfo?.id !== undefined && (
                <div><dt>Identificação</dt><dd>{userInfo.id}</dd></div>
              )}
              {userInfo?.permissao && (
                <div>
                  <dt>Permissão</dt>
                  <dd>{userInfo.permissao === "ADMIN" ? "Administrador" : userInfo.permissao === "RH" ? "Recursos Humanos" : userInfo.permissao}</dd>
                </div>
              )}
            </dl>
          </section>
        </details>
      </div>
    </header>
  );
}
