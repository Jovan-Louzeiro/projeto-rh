import type { Servidor } from "../types";
import type {
  Contrato,
  Documento,
  Ferias,
  LicencaAfastamento,
  Quinquenio,
  Requerimento,
  Solicitacao,
} from "../types";
import type { OpcoesServidorCompletas } from "../services/opcoesServidor";

export const servidores: Servidor[] = [
  { id: "1", nome: "João da Silva", matricula: "DEMO-001", cargo: "Professor", secretaria: "Educação", status: "Ativo", ativo: true, email: "joao.silva@example.test", genero_id: 1, racacor_id: 1 },
  { id: "2", nome: "Maria Oliveira", matricula: "DEMO-002", cargo: "Enfermeira", secretaria: "Saúde", status: "Ativo", ativo: true, email: "maria.oliveira@example.test", genero_id: 2, racacor_id: 2 },
  { id: "3", nome: "Carlos Lima", matricula: "DEMO-003", cargo: "Técnico Administrativo", secretaria: "Administração", status: "Ativo", ativo: true, email: "carlos.lima@example.test", genero_id: 1, racacor_id: 1 },
  { id: "4", nome: "Ana Souza", matricula: "DEMO-004", cargo: "Assistente Social", secretaria: "Assistência Social", status: "Ativo", ativo: true, email: "ana.souza@example.test", genero_id: 2, racacor_id: 3 },
  { id: "5", nome: "Pedro Mendes", matricula: "DEMO-005", cargo: "Vigilante", secretaria: "Infraestrutura", status: "Afastado", ativo: false, email: "pedro.mendes@example.test", genero_id: 1, racacor_id: 2 },
  { id: "6", nome: "Lucas Pereira", matricula: "DEMO-006", cargo: "Motorista", secretaria: "Transporte", status: "Ativo", ativo: true, email: "lucas.pereira@example.test", genero_id: 1, racacor_id: 1 },
  { id: "7", nome: "Fernanda Costa", matricula: "DEMO-007", cargo: "Psicóloga", secretaria: "Assistência Social", status: "Ativo", ativo: true, email: "fernanda.costa@example.test", genero_id: 2, racacor_id: 2 },
];

export const opcoesServidorDemo: OpcoesServidorCompletas = {
  sexos: [],
  generos: [{ id: 1, descricao: "Masculino" }, { id: 2, descricao: "Feminino" }],
  racasCor: [{ id: 1, descricao: "Branca" }, { id: 2, descricao: "Parda" }, { id: 3, descricao: "Preta" }],
  estadosCivis: [],
  cargos: [],
  funcoes: [],
  departamentos: [],
  tiposVinculo: [{ id: 1, descricao: "Efetivo" }, { id: 2, descricao: "Temporário" }],
  escolaridades: [],
  tiposEnsinoMedio: [],
  zonasEndereco: [],
  localizacoesDiferenciadas: [],
  comunidadesIndigenas: [],
  situacoes: [],
};

export const feriasDemo: Ferias[] = [
  { id: "demo-ferias-1", servidorId: "1", servidor: "João da Silva", matricula: "DEMO-001", cpf: "Dado fictício", cargo: "Professor", secretaria: "Educação", periodoAquisitivoInicio: "2025-01-01", periodoAquisitivoFim: "2025-12-31", diasDireito: 30, inicio: "2026-07-06", fim: "2026-08-04", dias: 30, abonoPecuniario: false, antecipacaoDecimoTerceiro: true, observacoes: "Registro de demonstração.", situacao: "Aprovada" },
  { id: "demo-ferias-2", servidorId: "2", servidor: "Maria Oliveira", matricula: "DEMO-002", cpf: "Dado fictício", cargo: "Enfermeira", secretaria: "Saúde", periodoAquisitivoInicio: "2025-03-01", periodoAquisitivoFim: "2026-02-28", diasDireito: 30, inicio: "2026-12-01", fim: "2026-12-30", dias: 30, abonoPecuniario: false, antecipacaoDecimoTerceiro: false, observacoes: "Aguardando análise.", situacao: "Pendente" },
];

export const licencasDemo: LicencaAfastamento[] = [
  { id: "demo-licenca-1", servidorId: "3", servidor: "Carlos Lima", matricula: "DEMO-003", cpf: "Dado fictício", cargo: "Técnico Administrativo", secretaria: "Administração", tipo: "Licença para tratamento de saúde", inicio: "2026-10-20", termino: "2026-10-27", semDataTermino: false, dias: 8, previsaoRetorno: "2026-10-28", documento: "Atestado médico (fictício)", numeroDocumento: "DOC-DEMO-001", dataDocumento: "2026-10-20", orgaoEmissor: "Unidade de Saúde (demonstração)", observacoes: "Registro de demonstração.", situacao: "Em andamento" },
  { id: "demo-licenca-2", servidorId: "4", servidor: "Ana Souza", matricula: "DEMO-004", cpf: "Dado fictício", cargo: "Assistente Social", secretaria: "Assistência Social", tipo: "Licença capacitação", inicio: "2026-11-16", termino: "2026-11-20", semDataTermino: false, dias: 5, previsaoRetorno: "2026-11-21", documento: "Portaria (fictícia)", numeroDocumento: "DOC-DEMO-002", dataDocumento: "2026-10-25", orgaoEmissor: "RH (demonstração)", observacoes: "Exemplo para visualização da tela.", situacao: "Pendente" },
];

export const contratosDemo: Contrato[] = [
  { id: "demo-contrato-1", servidorId: "5", servidor: "Pedro Mendes", matricula: "DEMO-005", cpf: "Dado fictício", cargo: "Vigilante", secretaria: "Infraestrutura", numero: "CT-DEMO-001", tipo: "Temporário", cargoFuncao: "Vigilante", inicio: "2026-01-10", termino: "2026-12-31", cargaHorariaSemanal: 40, remuneracao: 3200, localTrabalho: "Unidade demonstrativa", situacao: "Ativo", dataAssinatura: "2026-01-08", motivoEncerramento: "", observacoes: "Contrato fictício para demonstração." },
  { id: "demo-contrato-2", servidorId: "6", servidor: "Lucas Pereira", matricula: "DEMO-006", cpf: "Dado fictício", cargo: "Motorista", secretaria: "Transporte", numero: "CT-DEMO-002", tipo: "Temporário", cargoFuncao: "Motorista", inicio: "2025-06-01", termino: "2026-05-31", cargaHorariaSemanal: 40, remuneracao: 2800, localTrabalho: "Unidade demonstrativa", situacao: "Encerrado", dataAssinatura: "2025-05-28", motivoEncerramento: "Término do prazo.", observacoes: "Contrato fictício para demonstração." },
];

export const quinqueniosDemo: Quinquenio[] = [
  { id: "demo-quinquenio-1", servidorId: "1", servidor: "João da Silva", matricula: "DEMO-001", cargo: "Professor", secretaria: "Educação", dataAdmissao: "2016-02-01", numero: 2, periodoAquisitivoInicio: "2021-02-01", periodoAquisitivoFim: "2026-01-31", dataAquisicao: "2026-02-01", percentualAdicional: 10, valorCalculado: 450, dataInicioPagamento: "2026-03-01", situacao: "Implantado", atoNumero: "ATO-DEMO-001", atoTipo: "Portaria", atoData: "2026-02-10", observacoes: "Registro fictício para demonstração." },
  { id: "demo-quinquenio-2", servidorId: "7", servidor: "Fernanda Costa", matricula: "DEMO-007", cargo: "Psicóloga", secretaria: "Assistência Social", dataAdmissao: "2021-08-15", numero: 1, periodoAquisitivoInicio: "2021-08-15", periodoAquisitivoFim: "2026-08-14", dataAquisicao: "2026-08-15", percentualAdicional: 5, valorCalculado: 225, dataInicioPagamento: "", situacao: "Em análise", atoNumero: "", atoTipo: "", atoData: "", observacoes: "Aguardando conferência dos dados." },
];

export const solicitacoesDemo: Solicitacao[] = [
  { id: "demo-solicitacao-1", servidorId: "2", servidor: "Maria Oliveira", tipo: "Declaração", data: "2026-10-28", descricao: "Solicitação de declaração de vínculo funcional.", anexo: "Sem anexo", situacao: "Pendente" },
  { id: "demo-solicitacao-2", servidorId: "3", servidor: "Carlos Lima", tipo: "Atualização cadastral", data: "2026-10-24", descricao: "Atualização de endereço residencial.", anexo: "Comprovante (fictício)", situacao: "Em análise" },
];

export const documentosDemo: Documento[] = [
  { id: "demo-documento-1", servidorId: "1", servidor: "João da Silva", tipo: "Diploma", categoria: "Funcional", numero: "DOC-DEMO-101", dataDocumento: "2020-03-15", dataValidade: "", descricao: "Diploma fictício para demonstração.", arquivoNome: "diploma-demonstracao.pdf", arquivoUrl: "" },
  { id: "demo-documento-2", servidorId: "4", servidor: "Ana Souza", tipo: "Certificado", categoria: "Funcional", numero: "DOC-DEMO-102", dataDocumento: "2024-08-02", dataValidade: "2028-08-02", descricao: "Certificado fictício para demonstração.", arquivoNome: "certificado-demonstracao.pdf", arquivoUrl: "" },
];

export const requerimentosDemo: Requerimento[] = [
  { id: "demo-requerimento-1", protocolo: "REQ-DEMO-0001", dataEntrada: "2026-10-29", servidorId: "2", servidor: "Maria Oliveira", matricula: "DEMO-002", cpf: "Dado fictício", cargo: "Enfermeira", secretaria: "Saúde", tipos: ["Declaração"], justificativa: "Solicitação de declaração funcional para fins demonstrativos.", anexos: [], situacao: "Pendente", responsavel: "Equipe de RH (demonstração)", assinatura: { aceite: true, dataHora: "2026-10-29T10:00:00" }, historico: [] },
  { id: "demo-requerimento-2", protocolo: "REQ-DEMO-0002", dataEntrada: "2026-10-25", servidorId: "1", servidor: "João da Silva", matricula: "DEMO-001", cpf: "Dado fictício", cargo: "Professor", secretaria: "Educação", tipos: ["Férias"], justificativa: "Solicitação fictícia de férias para demonstração.", anexos: [], situacao: "Em análise", responsavel: "Equipe de RH (demonstração)", assinatura: { aceite: true, dataHora: "2026-10-25T14:30:00" }, historico: [] },
];

export type ResultadoListaDemo<T> = {
  dados: T[];
  demonstracao: boolean;
  aviso: string;
};

export async function carregarListaComDemo<T>(
  carregar: () => Promise<T[]>,
  dadosDemo: readonly T[],
  signal?: AbortSignal,
): Promise<ResultadoListaDemo<T>> {
  try {
    const dados = await carregar();
    if (dados.length > 0) return { dados, demonstracao: false, aviso: "" };
    return {
      dados: [...dadosDemo],
      demonstracao: true,
      aviso: "Ainda não há registros na API. Exibindo dados fictícios para demonstração.",
    };
  } catch (error) {
    if (signal?.aborted || (error instanceof DOMException && error.name === "AbortError")) {
      throw error;
    }
    return {
      dados: [...dadosDemo],
      demonstracao: true,
      aviso: "A API não está disponível. Exibindo dados fictícios para demonstração.",
    };
  }
}
