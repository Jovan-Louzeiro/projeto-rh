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
  { id: "1", nome: "João da Silva", matricula: "DEMO-001", cargo: "Professor", secretaria: "Educação", status: "Ativo", ativo: true, situacao_id: 1, email: "joao.silva@example.test", genero_id: 1, racacor_id: 1 },
  { id: "2", nome: "Maria Oliveira", matricula: "DEMO-002", cargo: "Enfermeira", secretaria: "Saúde", status: "Inativo", ativo: true, situacao_id: 2, email: "maria.oliveira@example.test", genero_id: 2, racacor_id: 2 },
  { id: "3", nome: "Carlos Lima", matricula: "DEMO-003", cargo: "Técnico Administrativo", secretaria: "Administração", status: "Exonerado", ativo: true, situacao_id: 3, email: "carlos.lima@example.test", genero_id: 1, racacor_id: 1 },
  { id: "4", nome: "Ana Souza", matricula: "DEMO-004", cargo: "Assistente Social", secretaria: "Assistência Social", status: "Aposentado", ativo: true, situacao_id: 4, email: "ana.souza@example.test", genero_id: 2, racacor_id: 3 },
  { id: "5", nome: "Pedro Mendes", matricula: "DEMO-005", cargo: "Vigilante", secretaria: "Infraestrutura", status: "Ativo", ativo: false, situacao_id: 1, email: "pedro.mendes@example.test", genero_id: 1, racacor_id: 2 },
  { id: "6", nome: "Lucas Pereira", matricula: "DEMO-006", cargo: "Motorista", secretaria: "Transporte", status: "Ativo", ativo: true, situacao_id: 1, email: "lucas.pereira@example.test", genero_id: 1, racacor_id: 1 },
  { id: "7", nome: "Fernanda Costa", matricula: "DEMO-007", cargo: "Psicóloga", secretaria: "Assistência Social", status: "Ativo", ativo: true, situacao_id: 1, email: "fernanda.costa@example.test", genero_id: 2, racacor_id: 2 },
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
  situacoes: [
    { id: 1, descricao: "Ativo" },
    { id: 2, descricao: "Inativo" },
    { id: 3, descricao: "Exonerado" },
    { id: 4, descricao: "Aposentado" },
  ],
};

function servidoresParaDemo(lista: readonly Servidor[]): Servidor[] {
  return [
    ...lista.filter(servidor => servidor.ativo !== false),
    ...lista.filter(servidor => servidor.ativo === false),
  ];
}

function cargoDemo(servidor: Servidor, indice: number): string {
  if (servidor.cargo && servidor.cargo !== "Não informado") return servidor.cargo;
  return ["Professor", "Assistente administrativo"][indice % 2];
}

function secretariaDemo(servidor: Servidor, indice: number): string {
  if (servidor.secretaria && servidor.secretaria !== "Não informado") return servidor.secretaria;
  return ["Educação", "Administração"][indice % 2];
}

export function gerarFeriasDemo(lista: readonly Servidor[]): Ferias[] {
  const servidores = servidoresParaDemo(lista);
  if (!servidores.length) return [];
  const meses = [1, 2, 3, 4, 5, 6, 7, 8, 11, 12];
  const diasFerias = [15, 20, 30, 15, 10, 20, 30, 15, 20, 30];
  const situacoes: Ferias["situacao"][] = [
    "Aprovada", "Aprovada", "Cancelada", "Aprovada", "Aprovada",
    "Aprovada", "Cancelada", "Aprovada", "Pendente", "Pendente",
  ];

  return Array.from({ length: 10 }, (_, indice) => {
    const servidor = servidores[indice % servidores.length];
    const mes = String(meses[indice]).padStart(2, "0");
    const inicio = `2026-${mes}-01`;
    const dias = diasFerias[indice];
    const anoAquisitivo = 2024 - Math.floor(indice / 5);

    return {
      id: `demo-ferias-${indice + 1}-${servidor.id}`,
      servidorId: servidor.id,
      servidor: servidor.nome,
      matricula: servidor.matricula,
      cpf: servidor.cpf ?? "",
      cargo: cargoDemo(servidor, indice),
      secretaria: secretariaDemo(servidor, indice),
      periodoAquisitivoInicio: `${anoAquisitivo}-01-01`,
      periodoAquisitivoFim: `${anoAquisitivo}-12-31`,
      diasDireito: 30,
      inicio,
      fim: somarDias(inicio, dias - 1),
      dias,
      abonoPecuniario: indice % 4 === 1,
      antecipacaoDecimoTerceiro: indice % 3 === 0,
      observacoes: "Período simulado para demonstração; não consta como registro oficial.",
      situacao: situacoes[indice],
    };
  });
}

export function gerarLicencasDemo(lista: readonly Servidor[]): LicencaAfastamento[] {
  const servidores = servidoresParaDemo(lista);
  if (!servidores.length) return [];
  const meses = [1, 2, 3, 4, 5, 6, 7, 8, 9, 12];
  const tipos = [
    "Afastamento para capacitação",
    "Licença para qualificação profissional",
    "Afastamento para participação em curso",
    "Licença-prêmio por assiduidade",
    "Afastamento para capacitação",
  ];
  const situacoes: LicencaAfastamento["situacao"][] = [
    "Encerrada", "Encerrada", "Aprovada", "Encerrada", "Em análise",
    "Encerrada", "Aprovada", "Encerrada", "Encerrada", "Pendente",
  ];

  return Array.from({ length: 10 }, (_, indice) => {
    const servidor = servidores[indice % servidores.length];
    const mes = String(meses[indice]).padStart(2, "0");
    const inicio = `2026-${mes}-10`;
    const dias = indice % 3 === 0 ? 10 : 5;
    const termino = somarDias(inicio, dias - 1);

    return {
      id: `demo-licenca-${indice + 1}-${servidor.id}`,
      servidorId: servidor.id,
      servidor: servidor.nome,
      matricula: servidor.matricula,
      cpf: servidor.cpf ?? "",
      cargo: cargoDemo(servidor, indice),
      secretaria: secretariaDemo(servidor, indice),
      tipo: tipos[indice % tipos.length],
      inicio,
      termino,
      semDataTermino: false,
      dias,
      previsaoRetorno: somarDias(termino, 1),
      documento: "Requerimento de afastamento (demonstração)",
      numeroDocumento: `DEMO-LIC-2026-${String(indice + 1).padStart(3, "0")}`,
      dataDocumento: `2026-${mes}-01`,
      orgaoEmissor: "Departamento de Recursos Humanos",
      observacoes: "Registro simulado para demonstração; não consta como licença oficial.",
      situacao: situacoes[indice],
    };
  });
}

function somarAnos(data: string, anos: number): string {
  const resultado = new Date(`${data}T00:00:00Z`);
  resultado.setUTCFullYear(resultado.getUTCFullYear() + anos);
  return resultado.toISOString().slice(0, 10);
}

function subtrairDia(data: string): string {
  const resultado = new Date(`${data}T00:00:00Z`);
  resultado.setUTCDate(resultado.getUTCDate() - 1);
  return resultado.toISOString().slice(0, 10);
}

function somarDias(data: string, dias: number): string {
  const resultado = new Date(`${data}T00:00:00Z`);
  resultado.setUTCDate(resultado.getUTCDate() + dias);
  return resultado.toISOString().slice(0, 10);
}

function primeiroDiaMesSeguinte(data: string): string {
  const resultado = new Date(`${data}T00:00:00Z`);
  resultado.setUTCDate(1);
  resultado.setUTCMonth(resultado.getUTCMonth() + 1);
  return resultado.toISOString().slice(0, 10);
}

export function gerarQuinqueniosDemo(lista: readonly Servidor[]): Quinquenio[] {
  const servidores = servidoresParaDemo(lista);
  if (!servidores.length) return [];
  const situacoes: Quinquenio["situacao"][] = [
    "Implantado", "Concedido", "Em análise", "Aguardando concessão", "Implantado",
    "Suspenso", "Em análise", "Concedido", "Implantado", "Aguardando concessão",
  ];

  return Array.from({ length: 10 }, (_, indice) => {
    const servidor = servidores[indice % servidores.length];
    const numero = Math.floor(indice / servidores.length) + 1;
    const dataAquisicao = somarAnos("2026-02-01", -(numero - 1) * 5);
    const dataAdmissao = somarAnos(dataAquisicao, -numero * 5);
    const periodoAquisitivoInicio = somarAnos(dataAdmissao, (numero - 1) * 5);
    const implantado = situacoes[indice] === "Implantado" || situacoes[indice] === "Concedido";

    return {
      id: `demo-quinquenio-${indice + 1}-${servidor.id}`,
      servidorId: servidor.id,
      servidor: servidor.nome,
      matricula: servidor.matricula,
      cargo: cargoDemo(servidor, indice),
      secretaria: secretariaDemo(servidor, indice),
      dataAdmissao,
      numero,
      periodoAquisitivoInicio,
      periodoAquisitivoFim: subtrairDia(dataAquisicao),
      dataAquisicao,
      percentualAdicional: numero * 5,
      valorCalculado: numero * 225,
      dataInicioPagamento: implantado ? primeiroDiaMesSeguinte(dataAquisicao) : "",
      situacao: situacoes[indice],
      atoNumero: implantado ? `PORT-DEMO-2026-${String(indice + 1).padStart(3, "0")}` : "",
      atoTipo: implantado ? "Portaria" : "",
      atoData: implantado ? somarDias(dataAquisicao, 5) : "",
      observacoes: "Registro simulado para demonstração; não consta como concessão oficial.",
    };
  });
}

export const contratosDemo: Contrato[] = [
  { id: "demo-contrato-1", servidorId: "5", servidor: "Pedro Mendes", matricula: "DEMO-005", cpf: "Dado fictício", cargo: "Vigilante", secretaria: "Infraestrutura", numero: "CT-DEMO-001", tipo: "Temporário", cargoFuncao: "Vigilante", inicio: "2026-01-10", termino: "2026-12-31", cargaHorariaSemanal: 40, remuneracao: 3200, localTrabalho: "Unidade demonstrativa", situacao: "Ativo", dataAssinatura: "2026-01-08", motivoEncerramento: "", observacoes: "Contrato fictício para demonstração." },
  { id: "demo-contrato-2", servidorId: "6", servidor: "Lucas Pereira", matricula: "DEMO-006", cpf: "Dado fictício", cargo: "Motorista", secretaria: "Transporte", numero: "CT-DEMO-002", tipo: "Temporário", cargoFuncao: "Motorista", inicio: "2025-06-01", termino: "2026-05-31", cargaHorariaSemanal: 40, remuneracao: 2800, localTrabalho: "Unidade demonstrativa", situacao: "Encerrado", dataAssinatura: "2025-05-28", motivoEncerramento: "Término do prazo.", observacoes: "Contrato fictício para demonstração." },
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
