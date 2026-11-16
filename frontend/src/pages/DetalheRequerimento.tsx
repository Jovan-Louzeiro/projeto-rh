import { useEffect, useRef, useState } from "react";
import type { AnexoRequerimento, Requerimento, SituacaoRequerimento } from "../types";
import {
  alterarSituacaoRequerimento,
  baixarAnexoRequerimento,
  excluirAnexoRequerimento,
  enviarPdfAssinado,
  gerarDocumentoRequerimento,
  obterHistoricoRequerimento,
  obterRequerimento,
  LIMITE_ANEXO_REQUERIMENTO,
} from "../services/requerimentos";
import Icon from "../components/Icon";
import Modal from "../components/Modal";
import Status from "../components/Status";
import { SITUACOES_REQUERIMENTO, formatarData, tomRequerimento } from "./requerimentosConfig";

type Props = { id: string; onBack: () => void; onEdit: () => void };

function baixarBlob(blob: Blob, nome: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = nome;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
}

function tamanhoArquivo(tamanho: number) {
  return tamanho >= 1024 * 1024
    ? `${(tamanho / 1024 / 1024).toFixed(1)} MB`
    : `${Math.max(1, Math.ceil(tamanho / 1024))} KB`;
}

export default function DetalheRequerimento({ id, onBack, onEdit }: Props) {
  const [item, setItem] = useState<Requerimento | null>(null);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [alterar, setAlterar] = useState(false);
  const [situacao, setSituacao] = useState<SituacaoRequerimento | "">("");
  const [observacao, setObservacao] = useState("");
  const [arquivoAssinado, setArquivoAssinado] = useState<File | null>(null);
  const [enviandoAssinado, setEnviandoAssinado] = useState(false);
  const [excluindoAnexoId, setExcluindoAnexoId] = useState<string | null>(null);
  const inputAssinadoRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const controller = new AbortController();
    setItem(null);
    setErro("");
    void Promise.all([
      obterRequerimento(id, controller.signal),
      obterHistoricoRequerimento(id, controller.signal),
    ])
      .then(([registro, historico]) => setItem({ ...registro, historico }))
      .catch(error => {
        if (!controller.signal.aborted) {
          setErro(error instanceof Error ? error.message : "Não foi possível carregar o requerimento.");
        }
      });
    return () => controller.abort();
  }, [id]);

  async function baixarDocumento() {
    try {
      baixarBlob(await gerarDocumentoRequerimento(id), `requerimento-${item?.protocolo ?? id}.docx`);
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Não foi possível gerar o documento.");
    }
  }

  async function baixarAnexo(anexo: AnexoRequerimento) {
    if (!anexo.id) return;
    try {
      baixarBlob(await baixarAnexoRequerimento(id, anexo.id), anexo.nome);
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Não foi possível baixar o anexo.");
    }
  }

  async function excluirAnexo(anexo: AnexoRequerimento) {
    if (!anexo.id) {
      setErro("Não foi possível identificar o documento para exclusão.");
      return;
    }

    const tipoArquivo = anexo.assinado ? "o PDF assinado" : "o anexo";
    if (!window.confirm(`Deseja excluir ${tipoArquivo} "${anexo.nome}"? Esta ação não pode ser desfeita.`)) {
      return;
    }

    setExcluindoAnexoId(anexo.id);
    setErro("");
    setSucesso("");
    try {
      await excluirAnexoRequerimento(id, anexo.id);
      setItem(atual => atual
        ? { ...atual, anexos: atual.anexos.filter(registro => registro.id !== anexo.id) }
        : atual);
      setSucesso(anexo.assinado
        ? "PDF assinado excluído com sucesso."
        : "Anexo excluído com sucesso.");
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Não foi possível excluir o anexo.");
    } finally {
      setExcluindoAnexoId(null);
    }
  }

  async function subirArquivoAssinado() {
    if (!arquivoAssinado) {
      setErro("Selecione o PDF assinado pelo servidor.");
      return;
    }
    if (arquivoAssinado.type !== "application/pdf") {
      setErro("O arquivo selecionado deve estar no formato PDF.");
      return;
    }
    if (arquivoAssinado.size > LIMITE_ANEXO_REQUERIMENTO) {
      setErro(`O PDF deve ter no máximo ${Math.round(LIMITE_ANEXO_REQUERIMENTO / 1024 / 1024)} MB.`);
      return;
    }

    setEnviandoAssinado(true);
    setErro("");
    setSucesso("");
    try {
      const anexo = await enviarPdfAssinado(id, arquivoAssinado);
      setItem(atual => atual
        ? { ...atual, anexos: [...atual.anexos, anexo] }
        : atual);
      setArquivoAssinado(null);
      if (inputAssinadoRef.current) inputAssinadoRef.current.value = "";
      setSucesso("PDF assinado enviado e armazenado com sucesso.");
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Não foi possível enviar o PDF assinado.");
    } finally {
      setEnviandoAssinado(false);
    }
  }

  async function mudar() {
    if (!item || !situacao) return;
    try {
      const atualizado = await alterarSituacaoRequerimento(item.id, situacao, observacao);
      setItem(atualizado);
      setAlterar(false);
      setErro("");
      setSucesso("Situação atualizada com sucesso.");
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Não foi possível alterar a situação.");
    }
  }

  if (erro && !item) return <p className="form-error" role="alert">{erro}</p>;
  if (!item) return <p className="table-message">Carregando requerimento...</p>;

  const info = (titulo: string, valor?: string) => (
    <div key={titulo} className="requerimento-info-item">
      <span>{titulo}</span>
      <strong>{valor || "—"}</strong>
    </div>
  );
  const anexosAssinados = item.anexos.filter(anexo => anexo.assinado);
  const anexosComuns = item.anexos.filter(anexo => !anexo.assinado);

  return (
    <>
      <div className="page-head requerimento-detalhe-head">
        <div>
          <span className="requerimento-eyebrow">GESTÃO DE REQUERIMENTOS</span>
          <h1>Requerimento <span>{item.protocolo}</span></h1>
          <p>Consulte os dados, documentos e movimentações deste processo.</p>
        </div>
        <div className="header-actions">
          <button className="btn outline" onClick={onBack}><Icon name="arrow-left" /> Voltar</button>
          <button className="btn outline" onClick={onEdit}><Icon name="edit" /> Editar</button>
          <button className="btn primary" onClick={() => void baixarDocumento()}><Icon name="document" /> Baixar DOCX</button>
        </div>
      </div>

      {erro && <p className="form-error requerimento-feedback" role="alert">{erro}</p>}
      {sucesso && <p className="form-success requerimento-feedback" role="status">{sucesso}</p>}

      <article className="requerimento-detalhe">
        <section className="card requerimento-overview">
          <div className="requerimento-overview-heading">
            <div>
              <span className="requerimento-eyebrow">PREFEITURA DE CARUTAPERA</span>
              <h2>Resumo do requerimento</h2>
              <p>Departamento de Recursos Humanos</p>
            </div>
            <div className="requerimento-status-actions">
              <Status tone={tomRequerimento(item.situacao)}>{item.situacao}</Status>
              <button
                className="btn outline"
                onClick={() => {
                  setSituacao("");
                  setObservacao("");
                  setAlterar(true);
                }}
              >
                <Icon name="refresh" /> Alterar situação
              </button>
            </div>
          </div>
          <div className="requerimento-info-grid requerimento-summary-grid">
            {info("Protocolo", item.protocolo)}
            {info("Data de entrada", formatarData(item.dataEntrada))}
            {info("Responsável", item.responsavel)}
          </div>
        </section>

        <div className="requerimento-detalhe-grid">
          <div className="requerimento-detalhe-main">
            <section className="card requerimento-detail-card">
              <div className="requerimento-section-heading">
                <span className="requerimento-section-icon"><Icon name="user" /></span>
                <div><h2>Dados do servidor</h2><p>Identificação e informações funcionais</p></div>
              </div>
              <div className="requerimento-info-grid">
                {info("Nome completo", item.servidor)}
                {info("Matrícula", item.matricula)}
                {info("CPF", item.cpf)}
                {info("Cargo/Função", item.cargo)}
                {info("Lotação", item.lotacao || item.secretaria)}
                {info("Admissão", formatarData(item.dataAdmissao))}
                {info("Endereço", item.endereco)}
                {info("Número", item.numeroEndereco)}
                {info("Bairro", item.bairro)}
                {info("Cidade", item.cidade)}
                {info("Telefone", item.telefone)}
              </div>
            </section>

            <section className="card requerimento-detail-card">
              <div className="requerimento-section-heading">
                <span className="requerimento-section-icon"><Icon name="document" /></span>
                <div><h2>Solicitação</h2><p>Itens requeridos ao Departamento de Recursos Humanos</p></div>
              </div>
              <p className="official-text">VEM REQUERER AO(À) DIRETOR(A) DO DEPARTAMENTO DE RECURSOS HUMANOS</p>
              <ul className="requerimento-tipos-list">
                {item.tipos.map(tipo => (
                  <li key={tipo}>
                    <Icon name="check" />
                    {tipo}{tipo === "Outros" && item.outroEspecificacao ? `: ${item.outroEspecificacao}` : ""}
                  </li>
                ))}
              </ul>
              <div className="requerimento-justificativa">
                <span>Justificativa</span>
                <p className="detail-text">{item.justificativa || "Nenhuma justificativa informada."}</p>
              </div>
            </section>
          </div>

          <aside className="requerimento-detalhe-aside">
            <section className="card requerimento-detail-card requerimento-assinado-card">
              <div className="requerimento-section-heading">
                <span className="requerimento-section-icon"><Icon name="file-pdf" /></span>
                <div><h2>PDF assinado</h2><p>Documento assinado pelo servidor</p></div>
              </div>
              {anexosAssinados.length ? (
                <ul className="requerimento-assinados-list">
                  {anexosAssinados.map(anexo => (
                    <li key={anexo.id || anexo.nome}>
                      <div className="requerimento-file-row">
                        <button
                          className="requerimento-file-download"
                          type="button"
                          onClick={() => void baixarAnexo(anexo)}
                          disabled={!anexo.id}
                        >
                          <Icon name="file-pdf" />
                          <span><strong>{anexo.nome}</strong><small>PDF assinado · {tamanhoArquivo(anexo.tamanho)}</small></span>
                          <Icon name="download" />
                        </button>
                        <button
                          className="icon-btn danger requerimento-anexo-delete"
                          type="button"
                          title="Excluir PDF assinado"
                          aria-label={`Excluir PDF assinado ${anexo.nome}`}
                          disabled={!anexo.id || excluindoAnexoId !== null}
                          onClick={() => void excluirAnexo(anexo)}
                        >
                          <Icon name="trash" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="requerimento-empty-file">
                  <Icon name="file-pdf" />
                  <p>Nenhum arquivo assinado foi enviado.</p>
                </div>
              )}
              <label className="requerimento-upload-picker">
                <Icon name="upload" />
                <span>{arquivoAssinado?.name || "Selecionar PDF assinado"}</span>
                <input
                  ref={inputAssinadoRef}
                  type="file"
                  accept=".pdf,application/pdf"
                  aria-label="Selecionar PDF assinado pelo servidor"
                  onChange={event => {
                    setArquivoAssinado(event.target.files?.[0] ?? null);
                    setErro("");
                    setSucesso("");
                  }}
                />
              </label>
              <p className="requerimento-upload-help">
                Apenas PDF, até {Math.round(LIMITE_ANEXO_REQUERIMENTO / 1024 / 1024)} MB.
              </p>
              <button
                className="btn primary requerimento-upload-submit"
                type="button"
                disabled={!arquivoAssinado || enviandoAssinado}
                onClick={() => void subirArquivoAssinado()}
              >
                <Icon name="upload" />
                {enviandoAssinado ? "Enviando..." : "Enviar arquivo assinado"}
              </button>
            </section>

            <section className="card requerimento-detail-card">
              <div className="requerimento-section-heading">
                <span className="requerimento-section-icon"><Icon name="paperclip" /></span>
                <div><h2>Outros anexos</h2><p>Documentos enviados com o requerimento</p></div>
              </div>
              {anexosComuns.length ? (
                <ul className="anexo-list">
                  {anexosComuns.map(anexo => (
                    <li className="requerimento-anexo-row" key={anexo.id || anexo.nome}>
                      <div className="requerimento-anexo-info">
                        {anexo.id
                          ? <button className="text-button" onClick={() => void baixarAnexo(anexo)}>{anexo.nome}</button>
                          : <strong>{anexo.nome}</strong>}
                        <span>{tamanhoArquivo(anexo.tamanho)}</span>
                      </div>
                      <button
                        className="icon-btn danger requerimento-anexo-delete"
                        type="button"
                        title="Excluir anexo"
                        aria-label={`Excluir anexo ${anexo.nome}`}
                        disabled={!anexo.id || excluindoAnexoId !== null}
                        onClick={() => void excluirAnexo(anexo)}
                      >
                        <Icon name="trash" />
                      </button>
                    </li>
                  ))}
                </ul>
              ) : <p className="requerimento-muted">Nenhum outro documento anexado.</p>}
            </section>

            <section className="card requerimento-detail-card">
              <div className="requerimento-section-heading">
                <span className="requerimento-section-icon"><Icon name="check" /></span>
                <div><h2>Declaração do servidor</h2><p>Confirmação eletrônica do requerente</p></div>
              </div>
              <p className="requerimento-assinatura-status">
                {item.assinatura.aceite
                  ? "Declaração eletrônica aceita pelo servidor."
                  : "Declaração ainda não aceita."}
              </p>
              <div className="requerimento-info-grid requerimento-info-grid-compact">
                {info("Data e hora", item.assinatura.dataHora ? new Date(item.assinatura.dataHora).toLocaleString("pt-BR") : undefined)}
                {info("Usuário", item.assinatura.usuario)}
                {info("IP", item.assinatura.ip)}
              </div>
            </section>

            <section className="card requerimento-detail-card">
              <div className="requerimento-section-heading">
                <span className="requerimento-section-icon"><Icon name="time-past" /></span>
                <div><h2>Histórico</h2><p>Movimentações do processo</p></div>
              </div>
              <div className="requerimento-timeline">
                {item.historico?.length
                  ? item.historico.map(historico => (
                    <div key={historico.id}>
                      <strong>{new Date(historico.dataHora).toLocaleString("pt-BR")}</strong>
                      <p>{historico.situacaoAnterior || "Criação"} → {historico.situacaoNova}</p>
                      <span>Responsável: {historico.responsavel}{historico.observacao ? ` — ${historico.observacao}` : ""}</span>
                    </div>
                  ))
                  : <p className="requerimento-muted">Nenhuma movimentação registrada.</p>}
              </div>
            </section>
          </aside>
        </div>
      </article>

      {alterar && (
        <Modal title="Alterar situação" onClose={() => setAlterar(false)}>
          <label>
            Nova situação
            <select value={situacao} onChange={event => setSituacao(event.target.value as SituacaoRequerimento)}>
              <option value="">Selecione</option>
              {SITUACOES_REQUERIMENTO.map(status => <option key={status}>{status}</option>)}
            </select>
          </label>
          <label>Observação<textarea value={observacao} onChange={event => setObservacao(event.target.value)} /></label>
          <div className="form-actions">
            <button className="btn outline" onClick={() => setAlterar(false)}>Cancelar</button>
            <button className="btn primary" disabled={!situacao} onClick={() => void mudar()}>Confirmar</button>
          </div>
        </Modal>
      )}
    </>
  );
}
