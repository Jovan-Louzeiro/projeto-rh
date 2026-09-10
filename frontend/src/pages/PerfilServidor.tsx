import type { Servidor } from "../types";
import Icon from "../components/Icon";
import Status from "../components/Status";

type Props = { servidor: Servidor; onQuinquenios: () => void };

export default function PerfilServidor({ servidor, onQuinquenios }: Props) {
  return <><div className="page-head"><div><h1>Perfil do Servidor</h1><p>Servidores / {servidor.nome}</p></div><button className="btn primary"><Icon name="edit" /> Editar</button></div>
  <div className="profile"><div className="card profile-side"><div className="profile-photo">{initials(servidor.nome)}</div><div className="profile-name">{servidor.nome}</div><div className="profile-role">{servidor.cargo} · Nível II</div><Status>{servidor.status}</Status><hr /><p className="small">Matrícula: {servidor.matricula}</p><p className="small">{servidor.email}</p><p className="small">📞 (98) 98765-4321</p></div>
  <div className="card"><div className="tabs"><button className="tab active">Dados Pessoais</button><button className="tab">Dados Funcionais</button><button className="tab">Histórico</button><button className="tab">Documentos</button><button className="tab" onClick={onQuinquenios}>Quinquênios</button></div>
  <h3 className="section-title">Informações Pessoais</h3><div className="info-grid">{info("CPF","123.456.789-00")}{info("RG","987654321 - SSP/MA")}{info("Data de nascimento","10/03/1986")}{info("Nome da mãe","Maria do Socorro Silva")}{info("Estado civil","Casado")}{info("Nacionalidade","Brasileira")}</div>
  <h3 className="section-title section-spaced">Dados Funcionais</h3><div className="info-grid">{info("Cargo",servidor.cargo)}{info("Secretaria",servidor.secretaria)}{info("Data de admissão","15/09/2011")}{info("Carga horária","40 horas semanais")}{info("Vínculo","Efetivo")}{info("Situação",servidor.status)}</div></div></div></>;
}
function info(label:string,value:string){return <div className="info"><small>{label}</small><strong>{value}</strong></div>}
function initials(name:string){return name.split(" ").map(x=>x[0]).slice(0,2).join("")}
