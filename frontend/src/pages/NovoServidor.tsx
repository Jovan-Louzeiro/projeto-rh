import { FormEvent, useEffect, useState } from "react";
import type { NovoServidor as NovoServidorDados } from "../services/servidores";
import { cadastrarServidor } from "../services/servidores";
import { listarSexos, type Sexo } from "../services/sexos";
import Icon from "../components/Icon";

type Props = { onBack: () => void };
const campos: Array<{ name: Exclude<keyof NovoServidorDados, "sexoId">; label: string; type?: string }> = [
  { name: "nome", label: "Nome completo" }, { name: "cpf", label: "CPF" }, { name: "rg", label: "RG" }, { name: "dataNascimento", label: "Data de nascimento", type: "date" }, { name: "matricula", label: "Matrícula" }, { name: "cargo", label: "Cargo" }, { name: "secretaria", label: "Secretaria" }, { name: "tipoVinculo", label: "Tipo de vínculo" }, { name: "dataAdmissao", label: "Data de admissão", type: "date" }, { name: "telefone", label: "Telefone" },
];

export default function NovoServidor({ onBack }: Props) {
  const [saving, setSaving] = useState(false); const [error, setError] = useState(""); const [sexos, setSexos] = useState<Sexo[]>([]); const [carregandoSexos, setCarregandoSexos] = useState(true);
  useEffect(() => { const controller = new AbortController(); listarSexos(controller.signal).then(setSexos).catch((erro: unknown) => { if (!(erro instanceof DOMException && erro.name === "AbortError")) setError("Não foi possível carregar as opções de sexo. Verifique se a API está em execução."); }).finally(() => setCarregandoSexos(false)); return () => controller.abort(); }, []);
  async function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setSaving(true); setError(""); const form = new FormData(event.currentTarget); const dados = { ...Object.fromEntries(campos.map(({ name }) => [name, String(form.get(name) ?? "")])), sexoId: String(form.get("sexoId") ?? "") } as NovoServidorDados; if (!dados.sexoId) { setSaving(false); setError("Selecione o sexo do servidor."); return; } try { await cadastrarServidor(dados); onBack(); } catch { setError("Não foi possível cadastrar o servidor. Verifique a conexão com a API."); } finally { setSaving(false); } }
  return <><div className="page-head"><div><h1>Novo Servidor</h1><p>Cadastre os dados funcionais do servidor.</p></div><button className="btn outline" onClick={onBack}><Icon name="arrow-left" /> Voltar</button></div><div className="card cadastro-servidor"><form onSubmit={submit}><div className="form-grid">{campos.map(({ name, label, type = "text" }) => <label key={name}>{label}<input name={name} type={type} placeholder={type === "date" ? undefined : label} required /></label>)}<label>Sexo<select name="sexoId" required defaultValue="" disabled={carregandoSexos}><option value="">{carregandoSexos ? "Carregando sexos..." : "Selecione o sexo"}</option>{sexos.map(sexo => <option key={sexo.id} value={sexo.id}>{sexo.nome}</option>)}</select></label></div>{error && <p className="form-error">{error}</p>}<div className="form-actions"><button type="button" className="btn outline" onClick={onBack}>Cancelar</button><button className="btn primary" disabled={saving || carregandoSexos}>{saving ? "Cadastrando..." : "Cadastrar servidor"}</button></div></form></div></>;
}
