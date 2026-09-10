export type Screen =
  | "dashboard"
  | "servidores"
  | "novo-servidor"
  | "ferias"
  | "nova-ferias"
  | "licencas"
  | "nova-licenca"
  | "contratos"
  | "novo-contrato"
  | "frequencia"
  | "quinquenios"
  | "novo-quinquenio"
  | "solicitacoes"
  | "nova-solicitacao"
  | "documentos"
  | "novo-documento"
  | "relatorios"
  | "relatorio-servidores"
  | "relatorio-ferias"
  | "relatorio-licencas"
  | "relatorio-quinquenios"
  | "relatorio-contratos"
  | "relatorio-frequencia"
  | "relatorio-admissoes"
  | "relatorio-desligamentos"
  | "configuracoes";

export type Status = "Ativo" | "Afastado" | "Licença" | "Férias";

export interface Servidor {
  id: string;
  nome: string;
  matricula: string;
  cargo: string;
  secretaria: string;
  status: Status;
  email: string;
  cpf?: string;
  dataAdmissao?: string;
  lotacao?: string;
  endereco?: string;
  numeroEndereco?: string;
  bairro?: string;
  cidade?: string;
  telefone?: string;
  sexoId?: string | number;
  sexo?: string;
}

export type SituacaoRequerimento = "Pendente" | "Em análise" | "Deferido" | "Indeferido" | "Finalizado" | "Cancelado";
export type TipoRequerimento = "Licença para qualificação profissional" | "Revisão de proventos" | "Aposentadoria" | "Afastamento para mandato eletivo" | "Licença paternidade" | "Promoção docente" | "Licença para tratar de interesse particular" | "Pagamento de atrasados" | "Licença maternidade" | "Licença motivo doença pessoa da família" | "Mudança de dados pessoais" | "Declaração" | "Licença para tratamento de saúde" | "Licença prêmio por assiduidade" | "Férias" | "Remoção" | "Certidão de tempo de serviço" | "Outros";
export interface AnexoRequerimento { id?: string; nome: string; tipo: string; tamanho: number; url?: string; enviadoEm?: string; }
export interface HistoricoRequerimento { id: string; dataHora: string; situacaoAnterior?: SituacaoRequerimento; situacaoNova: SituacaoRequerimento; responsavel: string; observacao?: string; }
export interface AssinaturaRequerimento { aceite: boolean; dataHora?: string; usuario?: string; ip?: string; }
export interface Requerimento {
  id: string;
  protocolo: string;
  dataEntrada: string;
  servidorId: string;
  servidor: string;
  matricula: string;
  cpf?: string;
  cargo: string;
  secretaria: string;
  lotacao?: string;
  dataAdmissao?: string;
  endereco?: string;
  numeroEndereco?: string;
  bairro?: string;
  cidade?: string;
  telefone?: string;
  tipos: TipoRequerimento[];
  outroEspecificacao?: string;
  justificativa: string;
  anexos: AnexoRequerimento[];
  situacao: SituacaoRequerimento;
  responsavel?: string;
  assinatura: AssinaturaRequerimento;
  historico?: HistoricoRequerimento[];
}

export type SituacaoFerias = "Pendente" | "Aprovada" | "Cancelada";

export interface Ferias {
  id: string;
  servidorId: string;
  servidor: string;
  matricula: string;
  cpf: string;
  cargo: string;
  secretaria: string;
  periodoAquisitivoInicio: string;
  periodoAquisitivoFim: string;
  diasDireito: number;
  inicio: string;
  fim: string;
  dias: number;
  abonoPecuniario: boolean;
  antecipacaoDecimoTerceiro: boolean;
  observacoes: string;
  situacao: SituacaoFerias;
}

export type SituacaoLicenca = "Pendente" | "Em análise" | "Aprovada" | "Rejeitada" | "Em andamento" | "Encerrada" | "Cancelada";

export interface LicencaAfastamento {
  id: string;
  servidorId: string;
  servidor: string;
  matricula: string;
  cpf: string;
  cargo: string;
  secretaria: string;
  tipo: string;
  inicio: string;
  termino: string | null;
  semDataTermino: boolean;
  dias: number | null;
  previsaoRetorno: string | null;
  documento: string;
  numeroDocumento: string;
  dataDocumento: string;
  orgaoEmissor: string;
  observacoes: string;
  situacao: SituacaoLicenca;
}

export type TipoContrato = "Temporário" | "Comissionado" | "Prestação de Serviço" | "Estágio" | "Outro";
export type SituacaoContrato = "Ativo" | "Aguardando assinatura" | "Suspenso" | "Encerrado" | "Rescindido";
export interface Contrato {
  id: string;
  servidorId: string;
  servidor: string;
  matricula: string;
  cpf: string;
  cargo: string;
  secretaria: string;
  numero: string;
  tipo: TipoContrato;
  cargoFuncao: string;
  inicio: string;
  termino: string;
  cargaHorariaSemanal: number;
  remuneracao: number;
  localTrabalho: string;
  situacao: SituacaoContrato;
  dataAssinatura: string;
  motivoEncerramento: string;
  observacoes: string;
  contratoArquivo?: string;
  termosAditivos?: string[];
  portarias?: string[];
  outrosDocumentos?: string[];
}

export type SituacaoQuinquenio = "Em análise" | "Aguardando concessão" | "Concedido" | "Implantado" | "Suspenso" | "Cancelado";
export interface Quinquenio {
  id: string;
  servidorId: string;
  servidor: string;
  matricula: string;
  cargo: string;
  secretaria: string;
  dataAdmissao: string;
  numero: number;
  periodoAquisitivoInicio: string;
  periodoAquisitivoFim: string;
  dataAquisicao: string;
  percentualAdicional: number;
  valorCalculado: number;
  dataInicioPagamento: string;
  situacao: SituacaoQuinquenio;
  atoNumero: string;
  atoTipo: string;
  atoData: string;
  atoDocumento?: string;
  observacoes: string;
}

export type TipoSolicitacao = "Férias" | "Licença/Afastamento" | "Declaração" | "Atualização cadastral" | "Documento" | "Quinquênio" | "Outro";
export type SituacaoSolicitacao = "Pendente" | "Em análise" | "Aprovada" | "Rejeitada";
export interface Solicitacao {
  id: string;
  servidorId: string;
  servidor: string;
  tipo: TipoSolicitacao;
  data: string;
  descricao: string;
  anexo?: string;
  situacao: SituacaoSolicitacao;
}

export type TipoDocumento = "RG" | "CPF" | "Diploma" | "Certificado" | "Portaria" | "Contrato" | "Declaração" | "Outro";
export type CategoriaDocumento = "Pessoal" | "Funcional" | "Financeiro" | "Saúde" | "Outros";
export interface Documento {
  id: string;
  servidorId: string;
  servidor: string;
  tipo: TipoDocumento;
  categoria: CategoriaDocumento;
  numero: string;
  dataDocumento: string;
  dataValidade?: string;
  descricao: string;
  arquivoNome: string;
  arquivoUrl: string;
}

export interface ModalState {
  type: "server" | "vacation" | null;
}
