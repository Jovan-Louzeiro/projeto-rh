import { useEffect, useMemo, useState } from "react";
import type { DetalhesServidor } from "../services/servidores";
import {
  detalharServidor,
  listarServidores,
} from "../services/servidores";
import {
  atualizarRequerimento,
  criarRequerimento,
  LIMITE_ANEXO_REQUERIMENTO,
  obterProximoProtocolo,
  obterRequerimento,
  TIPOS_ARQUIVO_REQUERIMENTO,
} from "../services/requerimentos";
import Icon from "../components/Icon";
import type {
  Requerimento,
  Servidor,
  SituacaoRequerimento,
  TipoRequerimento,
} from "../types";
import { TIPOS_REQUERIMENTO } from "./requerimentosConfig";

type Props = { onBack: () => void; onSaved: (id: string) => void; id?: string };
type Registro = Record<string, unknown>;

const hoje = () => new Date().toISOString().slice(0, 10);

function registros(valor: unknown): Registro[] {
  return Array.isArray(valor)
    ? valor.filter((item): item is Registro => Boolean(item) && typeof item === "object")
    : [];
}

function registro(valor: unknown): Registro | undefined {
  return valor && typeof valor === "object" ? valor as Registro : undefined;
}

function texto(valor: unknown): string | undefined {
  if (typeof valor === "string" && valor.trim()) return valor.trim();
  if (typeof valor === "number") return String(valor);
  return undefined;
}

function descricao(valor: unknown): string | undefined {
  const item = registro(valor);
  return texto(item?.descricao) ?? texto(item?.nome);
}

function dataIso(valor: unknown): string | undefined {
  if (valor instanceof Date && !Number.isNaN(valor.getTime())) return valor.toISOString().slice(0, 10);
  const valorTexto = texto(valor);
  return valorTexto ? valorTexto.slice(0, 10) : undefined;
}

function obterDadosServidor(servidor: Servidor, detalhes?: DetalhesServidor | null): Servidor {
  const matriculas = registros(servidor.matriculas);
  const matricula = matriculas.find(item => item.ativo === true) ?? matriculas[0];
  const historicos = registros(matricula?.historicos_funcionais);
  const historico = historicos
    .filter(item => item.data_fim == null)
    .sort((a, b) => String(b.data_inicio ?? "").localeCompare(String(a.data_inicio ?? "")))[0]
    ?? historicos.sort((a, b) => String(b.data_inicio ?? "").localeCompare(String(a.data_inicio ?? "")))[0];
  const contatos = registros(detalhes?.contatos ?? servidor.contatos)
    .filter(item => item.ativo !== false
      && (item.tipo_contato === "TELEFONE_MOVEL" || item.tipo_contato === "TELEFONE_FIXO"));
  const telefone = contatos
    .sort((a, b) => {
      const prioridade = (item: Registro) =>
        Number(item.principal === true) * 2 + Number(item.tipo_contato === "TELEFONE_MOVEL");
      return prioridade(b) - prioridade(a);
    })
    .map(item => texto(item.contato))
    .find(Boolean);
  const municipio = registro(servidor.municipio_endereco);

  return {
    ...servidor,
    matricula: texto(matricula?.numero) ?? servidor.matricula,
    cargo: descricao(historico?.cargo) ?? (servidor.cargo === "Não informado" ? "" : servidor.cargo),
    secretaria: descricao(historico?.departamento) ?? (servidor.secretaria === "Não informado" ? "" : servidor.secretaria),
    lotacao: descricao(historico?.departamento) ?? servidor.lotacao,
    dataAdmissao: dataIso(matricula?.admissao) ?? servidor.dataAdmissao,
    telefone: telefone ?? servidor.telefone,
    cidade: texto(municipio?.nome) ?? servidor.cidade,
  };
}

export default function NovoRequerimento({ onBack, onSaved, id }: Props) {
  const [servidores, setServidores] = useState<Servidor[]>([]);
  const [existente, setExistente] = useState<Requerimento | null>(null);
  const [detalhesServidor, setDetalhesServidor] = useState<DetalhesServidor | null>(null);
  const [protocolo, setProtocolo] = useState("");
  const [dataEntrada, setDataEntrada] = useState(hoje());
  const [servidorId, setServidorId] = useState("");
  const [tipos, setTipos] = useState<TipoRequerimento[]>([]);
  const [outro, setOutro] = useState("");
  const [justificativa, setJustificativa] = useState("");
  const [anexos, setAnexos] = useState<File[]>([]);
  const [aceite, setAceite] = useState(false);
  const [erro, setErro] = useState("");
  const [erroServidor, setErroServidor] = useState("");
  const [carregandoServidor, setCarregandoServidor] = useState(false);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    void listarServidores(controller.signal, {
      servidorSelect: [
        "id_servidor", "ativo", "nome_completo", "nome_social", "cpf",
        "logradouro", "numero", "bairro", "municipio_endereco_id",
        "municipio_endereco", "contatos",
      ],
      matriculasSelect: ["id_matricula", "numero", "ativo", "admissao", "tipo_vinculo_id", "historicos_funcionais"],
      historicosFuncionaisSelect: [
        "id_historico_funcional", "data_inicio", "data_fim", "cargo_id", "cargo",
        "funcao_id", "funcao", "departamento_id", "departamento",
        "situacao_historico_funcional_id", "situacao",
      ],
    })
      .then(setServidores)
      .catch(error => {
        if (!controller.signal.aborted) {
          setErro(error instanceof Error ? error.message : "Não foi possível carregar os servidores.");
        }
      });

    if (id) {
      void obterRequerimento(id, controller.signal)
        .then(preencher)
        .catch(error => {
          if (!controller.signal.aborted) {
            setErro(error instanceof Error ? error.message : "Não foi possível carregar o requerimento.");
          }
        });
    } else {
      void obterProximoProtocolo()
        .then(setProtocolo)
        .catch(error => setErro(error instanceof Error ? error.message : "Não foi possível gerar o protocolo."));
    }

    return () => controller.abort();
  }, [id]);

  useEffect(() => {
    if (!servidorId) {
      setDetalhesServidor(null);
      setCarregandoServidor(false);
      setErroServidor("");
      return;
    }

    const controller = new AbortController();
    setDetalhesServidor(null);
    setCarregandoServidor(true);
    setErroServidor("");
    void detalharServidor(servidorId, controller.signal)
      .then(setDetalhesServidor)
      .catch(error => {
        if (!controller.signal.aborted) {
          setErroServidor(error instanceof Error
            ? error.message
            : "Não foi possível carregar os dados completos do servidor.");
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setCarregandoServidor(false);
      });

    return () => controller.abort();
  }, [servidorId]);

  function preencher(item: Requerimento) {
    setExistente(item);
    setProtocolo(item.protocolo);
    setDataEntrada(item.dataEntrada);
    setServidorId(item.servidorId);
    setTipos(item.tipos);
    setOutro(item.outroEspecificacao ?? "");
    setJustificativa(item.justificativa);
    setAceite(item.assinatura.aceite);
  }

  const servidor = useMemo(() => {
    const listado = servidores.find(item => item.id === servidorId);
    const item = listado ?? (existente?.servidorId === servidorId
      ? {
          id: existente.servidorId,
          nome: existente.servidor,
          matricula: existente.matricula,
          cargo: existente.cargo,
          secretaria: existente.secretaria,
          status: "",
          email: "",
          cpf: existente.cpf,
          dataAdmissao: existente.dataAdmissao,
          lotacao: existente.lotacao,
          endereco: existente.endereco,
          numeroEndereco: existente.numeroEndereco,
          bairro: existente.bairro,
          cidade: existente.cidade,
          telefone: existente.telefone,
        } satisfies Servidor
      : undefined);
    return item ? obterDadosServidor(item, detalhesServidor) : undefined;
  }, [detalhesServidor, existente, servidorId, servidores]);

  function alternarTipo(tipo: TipoRequerimento) {
    setTipos(atual => atual.includes(tipo)
      ? atual.filter(item => item !== tipo)
      : [...atual, tipo]);
  }

  function anexar(files: FileList | null) {
    if (!files) return;
    const validos: File[] = [];
    for (const file of Array.from(files)) {
      if (!TIPOS_ARQUIVO_REQUERIMENTO.includes(file.type)) {
        setErro("Envie arquivos PDF, JPG, JPEG ou PNG.");
        continue;
      }
      if (file.size > LIMITE_ANEXO_REQUERIMENTO) {
        setErro(`Cada arquivo deve ter no máximo ${Math.round(LIMITE_ANEXO_REQUERIMENTO / 1024 / 1024)} MB.`);
        continue;
      }
      validos.push(file);
    }
    setAnexos(atual => [...atual, ...validos]);
  }

  async function salvar() {
    if (!servidor) return setErro("Selecione o servidor.");
    if (!tipos.length) return setErro("Selecione ao menos um tipo de requerimento.");
    if (tipos.includes("Outros") && !outro.trim()) return setErro("Especifique o outro requerimento.");
    if (!justificativa.trim()) return setErro("Informe a justificativa do requerimento.");
    if (!aceite) return setErro("É necessário concordar com a declaração do servidor.");

    setSalvando(true);
    setErro("");
    const dados = {
      protocolo,
      dataEntrada,
      servidorId: servidor.id,
      servidor: servidor.nome,
      matricula: servidor.matricula,
      cpf: servidor.cpf,
      cargo: servidor.cargo,
      secretaria: servidor.secretaria,
      lotacao: servidor.lotacao ?? servidor.secretaria,
      dataAdmissao: servidor.dataAdmissao,
      endereco: servidor.endereco,
      numeroEndereco: servidor.numeroEndereco,
      bairro: servidor.bairro,
      cidade: servidor.cidade,
      telefone: servidor.telefone,
      tipos,
      outroEspecificacao: tipos.includes("Outros") ? outro.trim() : undefined,
      justificativa: justificativa.trim(),
      situacao: existente?.situacao ?? "Pendente" as SituacaoRequerimento,
      responsavel: existente?.responsavel,
      assinatura: { aceite, dataHora: new Date().toISOString() },
    };

    try {
      const salvo = existente
        ? await atualizarRequerimento(existente.id, dados, anexos)
        : await criarRequerimento(dados, anexos);
      onSaved(salvo.id);
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Não foi possível salvar o requerimento.");
    } finally {
      setSalvando(false);
    }
  }

  const servidorExistenteSelecionado = existente?.servidorId === servidorId;
  const dado = (nome: string, valor?: string) => (
    <label key={nome}>
      {nome}
      <input readOnly value={valor || "—"} />
    </label>
  );

  return (
    <>
      <div className="page-head">
        <div>
          <h1>{id ? "Editar Requerimento" : "Novo Requerimento"}</h1>
          <p>{id ? "Atualize as informações permitidas do requerimento." : "Registre um novo requerimento funcional."}</p>
        </div>
        <button className="btn outline" onClick={onBack}><Icon name="arrow-left" /> Voltar</button>
      </div>
      <div className="card cadastro-servidor">
        <section className="form-section">
          <h2>Protocolo</h2>
          <div className="form-grid">
            <label>Nº do protocolo<input value={protocolo} readOnly /></label>
            <label>Data de entrada<input type="date" value={dataEntrada} readOnly /></label>
          </div>
          <p className="muted">O protocolo e a data de entrada são controlados pela API e só podem ser alterados por usuários autorizados.</p>
        </section>

        <section className="form-section">
          <h2>Dados do Servidor</h2>
          <div className="form-grid">
            <label className="full-col">
              Servidor
              <select
                value={servidorId}
                onChange={event => {
                  const novoId = event.target.value;
                  if (novoId !== existente?.servidorId) setAceite(false);
                  setServidorId(novoId);
                  setErro("");
                }}
              >
                <option value="">Selecione o servidor</option>
                {existente && !servidores.some(item => item.id === existente.servidorId) && (
                  <option value={existente.servidorId}>{existente.servidor} — {existente.matricula}</option>
                )}
                {servidores.map(item => (
                  <option value={item.id} key={item.id}>{item.nome} — {item.matricula}</option>
                ))}
              </select>
            </label>
            {dado("Matrícula", servidor?.matricula ?? (servidorExistenteSelecionado ? existente?.matricula : undefined))}
            {dado("CPF", servidor?.cpf ?? (servidorExistenteSelecionado ? existente?.cpf : undefined))}
            {dado("Cargo/Função", servidor?.cargo ?? (servidorExistenteSelecionado ? existente?.cargo : undefined))}
            {dado("Lotação", servidor?.lotacao ?? servidor?.secretaria ?? (servidorExistenteSelecionado ? existente?.lotacao : undefined))}
            {dado("Data de admissão", servidor?.dataAdmissao ?? (servidorExistenteSelecionado ? existente?.dataAdmissao : undefined))}
            {dado("Telefone", servidor?.telefone ?? (servidorExistenteSelecionado ? existente?.telefone : undefined))}
            {dado("Endereço", servidor?.endereco ?? (servidorExistenteSelecionado ? existente?.endereco : undefined))}
            {dado("Número", servidor?.numeroEndereco ?? (servidorExistenteSelecionado ? existente?.numeroEndereco : undefined))}
            {dado("Bairro", servidor?.bairro ?? (servidorExistenteSelecionado ? existente?.bairro : undefined))}
            {dado("Cidade", servidor?.cidade ?? (servidorExistenteSelecionado ? existente?.cidade : undefined))}
          </div>
          {carregandoServidor && <p className="muted" role="status">Carregando os dados completos do servidor...</p>}
          {erroServidor && <p className="form-error" role="alert">{erroServidor}</p>}
          {!servidorId && (
            <p className="muted">
              Servidor não encontrado?{" "}
              <button className="text-button" onClick={() => location.assign("/servidores/novo")}>Cadastrar novo servidor</button>
            </p>
          )}
        </section>

        <section className="form-section">
          <h2>Solicitação</h2>
          <p>Vem requerer ao(à) Diretor(a) do Departamento de Recursos Humanos:</p>
          <div className="requerimento-opcoes">
            {TIPOS_REQUERIMENTO.map(tipo => (
              <label key={tipo} className="check-option">
                <input type="checkbox" checked={tipos.includes(tipo)} onChange={() => alternarTipo(tipo)} /> {tipo}
              </label>
            ))}
          </div>
          {tipos.includes("Outros") && (
            <label>Especifique o requerimento<input value={outro} onChange={event => setOutro(event.target.value)} /></label>
          )}
        </section>

        <section className="form-section">
          <h2>Justificativa</h2>
          <label>
            Justificativa
            <textarea
              value={justificativa}
              maxLength={3000}
              onChange={event => setJustificativa(event.target.value)}
              placeholder="Informe a justificativa do requerimento..."
            />
          </label>
          <p className="muted text-right">{justificativa.length}/3000 caracteres</p>
        </section>

        <section className="form-section">
          <h2>Documentos anexos</h2>
          <label>Anexar documentos<input type="file" multiple accept="application/pdf,image/jpeg,image/png" onChange={event => anexar(event.target.files)} /></label>
          <p className="muted">PDF, JPG, JPEG ou PNG. Limite por arquivo: {Math.round(LIMITE_ANEXO_REQUERIMENTO / 1024 / 1024)} MB.</p>
          <ul className="anexo-list">
            {existente?.anexos.map(anexo => (
              <li key={anexo.id || anexo.nome}>{anexo.nome} <span>{Math.ceil(anexo.tamanho / 1024)} KB</span></li>
            ))}
            {anexos.map((anexo, index) => (
              <li key={`${anexo.name}-${index}`}>
                {anexo.name} <span>{Math.ceil(anexo.size / 1024)} KB</span>
                <button
                  className="icon-btn danger"
                  onClick={() => setAnexos(atual => atual.filter((_, indice) => indice !== index))}
                  title="Remover"
                >
                  <Icon name="trash" />
                </button>
              </li>
            ))}
          </ul>
        </section>

        <section className="form-section">
          <h2>Assinatura do Servidor</h2>
          <label className="check-option">
            <input type="checkbox" checked={aceite} onChange={event => setAceite(event.target.checked)} /> Li e concordo com a declaração acima.
          </label>
          <p className="muted">Declaro que as informações fornecidas neste requerimento são verdadeiras. A API registra data, hora, usuário e IP quando disponível.</p>
        </section>

        {erro && <p className="form-error" role="alert">{erro}</p>}
        <div className="form-actions">
          <button className="btn outline" onClick={onBack}>Cancelar</button>
          <button className="btn primary" disabled={salvando} onClick={salvar}>
            {salvando ? "Salvando..." : id ? "Salvar alterações" : "Salvar Requerimento"}
          </button>
        </div>
      </div>
    </>
  );
}
