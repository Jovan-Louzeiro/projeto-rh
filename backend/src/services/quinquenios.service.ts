import { AppError } from "@/errors/app.errors.js";
import { RegistroNaoEncontradoError } from "@/errors/dominios.errors.js";
import { prisma } from "@/lib/prisma.js";
import type { QuinquenioCampos, QuinquenioDados } from "@/schemas/quinquenios.schema.js";
import { SituacaoQuinquenio } from "#/generated/prisma/enums.js";
import { Prisma } from "#/generated/prisma/client.js";

const incluirRelacoes = {
  servidor: {
    select: { nome_completo: true },
  },
  matricula: {
    select: {
      numero: true,
      historicos_funcionais: {
        where: { data_fim: null },
        orderBy: { data_inicio: "desc" },
        take: 1,
        select: {
          cargo: { select: { descricao: true } },
          departamento: { select: { descricao: true } },
        },
      },
    },
  },
  anexo: {
    select: { nome: true },
  },
} satisfies Prisma.QuinquenioInclude;

type QuinquenioComRelacoes = Prisma.QuinquenioGetPayload<{
  include: typeof incluirRelacoes;
}>;

type SituacaoCalculada = "Aguardando concessão" | "Concedido" | "Implantado" | "Suspenso" | "Cancelado";

function dataBanco(data: string): Date {
  return new Date(`${data}T00:00:00.000Z`);
}

function dataResposta(data: Date): string {
  return data.toISOString().slice(0, 10);
}

function hoje(): string {
  const partes = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const valor = (tipo: string) => partes.find((parte) => parte.type === tipo)?.value ?? "";
  return `${valor("year")}-${valor("month")}-${valor("day")}`;
}

function adicionarAnos(data: string, anos: number): string {
  const resultado = dataBanco(data);
  resultado.setUTCFullYear(resultado.getUTCFullYear() + anos);
  return dataResposta(resultado);
}

function calcularPeriodo(dataAdmissao: string, numero: number) {
  const inicio = adicionarAnos(dataAdmissao, (numero - 1) * 5);
  const dataAquisicao = adicionarAnos(dataAdmissao, numero * 5);
  const fim = dataResposta(new Date(dataBanco(dataAquisicao).getTime() - 86400000));
  return { inicio, fim, dataAquisicao };
}

function calcularSituacao(
  dataAquisicao: string,
  dataInicioPagamento: string,
  situacaoSalva: SituacaoQuinquenio,
): SituacaoCalculada {
  if (situacaoSalva === SituacaoQuinquenio.CANCELADO) return "Cancelado";
  if (situacaoSalva === SituacaoQuinquenio.SUSPENSO) return "Suspenso";
  const dataAtual = hoje();
  if (dataAtual < dataAquisicao) return "Aguardando concessão";
  if (dataAtual < dataInicioPagamento) return "Concedido";
  return "Implantado";
}

function formatar(registro: QuinquenioComRelacoes) {
  const historico = registro.matricula?.historicos_funcionais[0];
  const dataAdmissao = dataResposta(registro.data_admissao);
  const dataAquisicao = dataResposta(registro.data_aquisicao);
  const dataInicioPagamento = dataResposta(registro.data_inicio_pagamento);
  return {
    id: String(registro.id_quinquenio),
    servidorId: String(registro.servidor_id),
    servidor: registro.servidor.nome_completo,
    matricula: registro.matricula?.numero ?? "",
    cargo: historico?.cargo.descricao ?? "",
    secretaria: historico?.departamento?.descricao ?? "",
    dataAdmissao,
    numero: registro.numero,
    periodoAquisitivoInicio: dataResposta(registro.periodo_aquisitivo_inicio),
    periodoAquisitivoFim: dataResposta(registro.periodo_aquisitivo_fim),
    dataAquisicao,
    percentualAdicional: registro.percentual_adicional,
    valorCalculado: registro.valor_calculado,
    dataInicioPagamento,
    situacao: calcularSituacao(dataAquisicao, dataInicioPagamento, registro.situacao),
    atoNumero: registro.ato_numero,
    atoTipo: registro.ato_tipo,
    atoData: dataResposta(registro.ato_data),
    atoDocumento: registro.anexo?.nome ?? "",
    observacoes: registro.observacoes ?? "",
  };
}

function validarPeriodo(dados: QuinquenioCampos, dataAdmissao: string) {
  const periodo = calcularPeriodo(dataAdmissao, dados.numero);
  if (dados.dataInicioPagamento < periodo.dataAquisicao) {
    throw new AppError(422, "O início do pagamento não pode ser anterior à data de aquisição.");
  }
  return periodo;
}

function arquivoDados(arquivo: Express.Multer.File) {
  const conteudo = new Uint8Array(arquivo.buffer.byteLength);
  conteudo.set(arquivo.buffer);
  return {
    nome: arquivo.originalname.replace(/[\\/]/g, "_").slice(0, 255),
    tipo: arquivo.mimetype,
    tamanho: arquivo.size,
    conteudo,
  };
}

export class QuinqueniosService {
  async listar() {
    const registros = await prisma.quinquenio.findMany({
      include: incluirRelacoes,
      orderBy: [{ criado_em: "desc" }, { id_quinquenio: "desc" }],
    });
    return registros.map(formatar);
  }

  async procurar(id: number) {
    const registro = await prisma.quinquenio.findUnique({
      where: { id_quinquenio: id },
      include: incluirRelacoes,
    });
    if (!registro) throw new RegistroNaoEncontradoError("Quinquênio");
    return formatar(registro);
  }

  async criar(dados: QuinquenioDados, arquivo?: Express.Multer.File) {
    const servidor = await this.obterServidor(dados.servidorId);
    const matricula = servidor.matriculas[0];
    if (!matricula) {
      throw new AppError(422, "O servidor precisa ter uma matrícula com data de admissão cadastrada.");
    }

    const dataAdmissao = dataResposta(matricula.admissao);
    const campos = this.camposComPeriodo(dados, dataAdmissao);
    await this.validarNumero(dados.servidorId, dados.numero);

    const registro = await prisma.quinquenio.create({
      data: {
        servidor_id: dados.servidorId,
        matricula_id: matricula.id_matricula,
        data_admissao: dataBanco(dataAdmissao),
        ...campos,
        ...(arquivo ? { anexo: { create: arquivoDados(arquivo) } } : {}),
      },
      include: incluirRelacoes,
    });
    return formatar(registro);
  }

  async atualizar(id: number, dados: QuinquenioCampos, arquivo?: Express.Multer.File) {
    const atual = await prisma.quinquenio.findUnique({
      where: { id_quinquenio: id },
      include: { matricula: { select: { admissao: true } } },
    });
    if (!atual) throw new RegistroNaoEncontradoError("Quinquênio");
    if (atual.situacao === SituacaoQuinquenio.CANCELADO) {
      throw new AppError(409, "Não é possível editar um quinquênio cancelado.");
    }

    const dataAdmissao = dataResposta(atual.data_admissao);
    const campos = this.camposComPeriodo(dados, dataAdmissao);
    await this.validarNumero(atual.servidor_id, dados.numero, id);

    const registro = await prisma.quinquenio.update({
      where: { id_quinquenio: id },
      data: {
        ...campos,
        ...(atual.situacao === SituacaoQuinquenio.SUSPENSO
          ? { situacao: SituacaoQuinquenio.SUSPENSO }
          : {}),
        ...(arquivo ? {
          anexo: {
            upsert: {
              create: arquivoDados(arquivo),
              update: arquivoDados(arquivo),
            },
          },
        } : {}),
      },
      include: incluirRelacoes,
    });
    return formatar(registro);
  }

  async cancelar(id: number) {
    const atual = await prisma.quinquenio.findUnique({ where: { id_quinquenio: id } });
    if (!atual) throw new RegistroNaoEncontradoError("Quinquênio");
    if (atual.situacao === SituacaoQuinquenio.CANCELADO) {
      throw new AppError(409, "Este quinquênio já foi cancelado.");
    }
    const registro = await prisma.quinquenio.update({
      where: { id_quinquenio: id },
      data: {
        situacao: SituacaoQuinquenio.CANCELADO,
        cancelado_em: new Date(),
      },
      include: incluirRelacoes,
    });
    return formatar(registro);
  }

  async baixarDocumento(id: number) {
    const registro = await prisma.quinquenio.findUnique({
      where: { id_quinquenio: id },
      select: { anexo: { select: { nome: true, tipo: true, conteudo: true } } },
    });
    if (!registro) throw new RegistroNaoEncontradoError("Quinquênio");
    if (!registro.anexo) throw new RegistroNaoEncontradoError("Ato administrativo do quinquênio");
    return {
      ...registro.anexo,
      conteudo: Buffer.from(registro.anexo.conteudo),
    };
  }

  private camposComPeriodo(dados: QuinquenioCampos, dataAdmissao: string) {
    const periodo = validarPeriodo(dados, dataAdmissao);
    const situacao = calcularSituacao(
      periodo.dataAquisicao,
      dados.dataInicioPagamento,
      SituacaoQuinquenio.AGUARDANDO_CONCESSAO,
    );
    return {
      numero: dados.numero,
      periodo_aquisitivo_inicio: dataBanco(periodo.inicio),
      periodo_aquisitivo_fim: dataBanco(periodo.fim),
      data_aquisicao: dataBanco(periodo.dataAquisicao),
      percentual_adicional: dados.percentualAdicional,
      valor_calculado: dados.valorCalculado,
      data_inicio_pagamento: dataBanco(dados.dataInicioPagamento),
      situacao: {
        "Aguardando concessão": SituacaoQuinquenio.AGUARDANDO_CONCESSAO,
        Concedido: SituacaoQuinquenio.CONCEDIDO,
        Implantado: SituacaoQuinquenio.IMPLANTADO,
        Suspenso: SituacaoQuinquenio.SUSPENSO,
        Cancelado: SituacaoQuinquenio.CANCELADO,
      }[situacao],
      ato_numero: dados.atoNumero,
      ato_tipo: dados.atoTipo,
      ato_data: dataBanco(dados.atoData),
      observacoes: dados.observacoes || null,
    };
  }

  private async obterServidor(id: number) {
    const servidor = await prisma.servidor.findUnique({
      where: { id_servidor: id },
      select: {
        id_servidor: true,
        matriculas: {
          orderBy: [{ ativo: "desc" }, { admissao: "desc" }, { id_matricula: "desc" }],
          take: 1,
          select: { id_matricula: true, admissao: true },
        },
      },
    });
    if (!servidor) throw new RegistroNaoEncontradoError("Servidor");
    return servidor;
  }

  private async validarNumero(servidorId: number, numero: number, ignorarId?: number) {
    const existente = await prisma.quinquenio.findFirst({
      where: {
        servidor_id: servidorId,
        numero,
        ...(ignorarId ? { id_quinquenio: { not: ignorarId } } : {}),
      },
      select: { id_quinquenio: true },
    });
    if (existente) {
      throw new AppError(409, `O ${numero}º quinquênio deste servidor já está cadastrado.`);
    }
  }
}
