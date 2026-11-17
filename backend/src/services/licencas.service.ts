import { AppError } from "@/errors/app.errors.js";
import { RegistroNaoEncontradoError } from "@/errors/dominios.errors.js";
import { prisma } from "@/lib/prisma.js";
import type { LicencaCampos, LicencaDados } from "@/schemas/licencas.schema.js";
import { SituacaoLicenca as SituacaoLicencaBanco } from "#/generated/prisma/enums.js";
import { Prisma } from "#/generated/prisma/client.js";

const incluirRelacoes = {
  servidor: {
    select: {
      nome_completo: true,
      cpf: true,
    },
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
} satisfies Prisma.LicencaInclude;

type LicencaComRelacoes = Prisma.LicencaGetPayload<{
  include: typeof incluirRelacoes;
}>;

function dataBanco(data: string): Date {
  return new Date(`${data}T00:00:00.000Z`);
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

function dataResposta(data: Date | null): string | null {
  return data ? data.toISOString().slice(0, 10) : null;
}

function formatar(registro: LicencaComRelacoes) {
  const historico = registro.matricula?.historicos_funcionais[0];
  const dataFim = registro.termino ?? registro.previsao_retorno;
  const situacao = registro.situacao === SituacaoLicencaBanco.CANCELADA
    ? "Cancelada"
    : registro.inicio.toISOString().slice(0, 10) > hoje()
      ? "Aprovada"
      : dataFim && dataFim.toISOString().slice(0, 10) < hoje()
        ? "Encerrada"
        : "Em andamento";
  return {
    id: String(registro.id_licenca),
    servidorId: String(registro.servidor_id),
    servidor: registro.servidor.nome_completo,
    matricula: registro.matricula?.numero ?? "",
    cpf: registro.servidor.cpf,
    cargo: historico?.cargo.descricao ?? "",
    secretaria: historico?.departamento?.descricao ?? "",
    tipo: registro.tipo,
    inicio: dataResposta(registro.inicio) ?? "",
    termino: dataResposta(registro.termino),
    semDataTermino: registro.sem_data_termino,
    dias: registro.dias,
    previsaoRetorno: dataResposta(registro.previsao_retorno),
    documento: registro.anexo?.nome ?? "",
    numeroDocumento: registro.numero_documento ?? "",
    dataDocumento: dataResposta(registro.data_documento) ?? "",
    orgaoEmissor: registro.orgao_emissor ?? "",
    observacoes: registro.observacoes ?? "",
    situacao,
  };
}

function contarDias(inicio: string, termino: string): number {
  return Math.floor((dataBanco(termino).getTime() - dataBanco(inicio).getTime()) / 86400000) + 1;
}

function validar(dados: LicencaCampos) {
  if (!dados.semDataTermino && !dados.termino) {
    throw new AppError(422, "Informe a data de término ou selecione a opção sem data de término.");
  }
  if (dados.termino && dados.termino < dados.inicio) {
    throw new AppError(422, "A data de término deve ser posterior à data de início.");
  }
  if (dados.previsaoRetorno && dados.previsaoRetorno < dados.inicio) {
    throw new AppError(422, "A previsão de retorno não pode ser anterior ao início da licença.");
  }
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

export class LicencasService {
  async listar() {
    const registros = await prisma.licenca.findMany({
      include: incluirRelacoes,
      orderBy: [{ criado_em: "desc" }, { id_licenca: "desc" }],
    });
    return registros.map(formatar);
  }

  async listarPorServidor(servidorId: number) {
    await this.obterServidor(servidorId);
    const registros = await prisma.licenca.findMany({
      where: { servidor_id: servidorId },
      include: incluirRelacoes,
      orderBy: [{ criado_em: "desc" }, { id_licenca: "desc" }],
    });
    return registros.map(formatar);
  }

  async procurar(id: number) {
    const registro = await prisma.licenca.findUnique({
      where: { id_licenca: id },
      include: incluirRelacoes,
    });
    if (!registro) throw new RegistroNaoEncontradoError("Licença");
    return formatar(registro);
  }

  async criar(dados: LicencaDados, arquivo?: Express.Multer.File) {
    validar(dados);
    const servidor = await this.obterServidor(dados.servidorId);
    await this.validarSobreposicao(dados.servidorId, dados);

    const registro = await prisma.licenca.create({
      data: {
        servidor_id: dados.servidorId,
        matricula_id: servidor.matriculas[0]?.id_matricula ?? null,
        ...this.dadosBanco(dados),
        ...(arquivo ? { anexo: { create: arquivoDados(arquivo) } } : {}),
      },
      include: incluirRelacoes,
    });
    return formatar(registro);
  }

  async atualizar(id: number, dados: LicencaCampos, arquivo?: Express.Multer.File) {
    validar(dados);
    const atual = await prisma.licenca.findUnique({ where: { id_licenca: id } });
    if (!atual) throw new RegistroNaoEncontradoError("Licença");
    if (atual.situacao === SituacaoLicencaBanco.CANCELADA) {
      throw new AppError(409, "Não é possível editar uma licença cancelada.");
    }
    await this.validarSobreposicao(atual.servidor_id, dados, id);

    const registro = await prisma.licenca.update({
      where: { id_licenca: id },
      data: {
        ...this.dadosBanco(dados),
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
    const atual = await prisma.licenca.findUnique({ where: { id_licenca: id } });
    if (!atual) throw new RegistroNaoEncontradoError("Licença");
    if (atual.situacao === SituacaoLicencaBanco.CANCELADA) {
      throw new AppError(409, "Esta licença já foi cancelada.");
    }
    const registro = await prisma.licenca.update({
      where: { id_licenca: id },
      data: { situacao: SituacaoLicencaBanco.CANCELADA },
      include: incluirRelacoes,
    });
    return formatar(registro);
  }

  async baixarDocumento(id: number) {
    const registro = await prisma.licenca.findUnique({
      where: { id_licenca: id },
      select: { anexo: { select: { nome: true, tipo: true, conteudo: true } } },
    });
    if (!registro) throw new RegistroNaoEncontradoError("Licença");
    if (!registro.anexo) throw new RegistroNaoEncontradoError("Documento da licença");
    return {
      ...registro.anexo,
      conteudo: Buffer.from(registro.anexo.conteudo),
    };
  }

  private async obterServidor(id: number) {
    const servidor = await prisma.servidor.findUnique({
      where: { id_servidor: id },
      select: {
        matriculas: {
          orderBy: [{ ativo: "desc" }, { admissao: "desc" }, { id_matricula: "desc" }],
          take: 1,
          select: { id_matricula: true },
        },
      },
    });
    if (!servidor) throw new RegistroNaoEncontradoError("Servidor");
    return servidor;
  }

  private async validarSobreposicao(servidorId: number, dados: LicencaCampos, ignorarId?: number) {
    const fim = dados.semDataTermino || !dados.termino
      ? "9999-12-31"
      : dados.termino;
    const sobreposicao = await prisma.licenca.findFirst({
      where: {
        servidor_id: servidorId,
        situacao: { not: SituacaoLicencaBanco.CANCELADA },
        inicio: { lte: dataBanco(fim) },
        OR: [
          { termino: null },
          { termino: { gte: dataBanco(dados.inicio) } },
        ],
        ...(ignorarId ? { id_licenca: { not: ignorarId } } : {}),
      },
      select: { id_licenca: true },
    });
    if (sobreposicao) {
      throw new AppError(409, "Já existe uma licença ou afastamento sobreposto para este servidor.");
    }
  }

  private dadosBanco(dados: LicencaCampos) {
    const termino = dados.semDataTermino ? null : dados.termino;
    return {
      tipo: dados.tipo,
      inicio: dataBanco(dados.inicio),
      termino: termino ? dataBanco(termino) : null,
      sem_data_termino: dados.semDataTermino,
      dias: termino ? contarDias(dados.inicio, termino) : null,
      previsao_retorno: dados.previsaoRetorno ? dataBanco(dados.previsaoRetorno) : null,
      numero_documento: dados.numeroDocumento || null,
      data_documento: dados.dataDocumento ? dataBanco(dados.dataDocumento) : null,
      orgao_emissor: dados.orgaoEmissor || null,
      observacoes: dados.observacoes || null,
      situacao: SituacaoLicencaBanco.APROVADA,
    };
  }
}
