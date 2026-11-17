import { AppError } from "@/errors/app.errors.js";
import { RegistroNaoEncontradoError } from "@/errors/dominios.errors.js";
import { prisma } from "@/lib/prisma.js";
import type { FeriasCampos, FeriasDados } from "@/schemas/ferias.schema.js";
import { SituacaoFerias } from "#/generated/prisma/enums.js";
import { Prisma } from "#/generated/prisma/client.js";

const incluirServidor = {
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
} satisfies Prisma.FeriasInclude;

type FeriasComDadosServidor = Prisma.FeriasGetPayload<{
  include: typeof incluirServidor;
}>;

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

function formatar(registro: FeriasComDadosServidor) {
  const historico = registro.matricula?.historicos_funcionais[0];
  const inicio = dataResposta(registro.inicio);
  const fim = dataResposta(registro.fim);
  const dataAtual = hoje();
  const situacao = registro.situacao === SituacaoFerias.CANCELADA
    ? "Cancelada"
    : dataAtual < inicio
      ? "Aprovada"
      : dataAtual <= fim
        ? "Em andamento"
        : "Encerrada";
  return {
    id: String(registro.id_ferias),
    servidorId: String(registro.servidor_id),
    servidor: registro.servidor.nome_completo,
    matricula: registro.matricula?.numero ?? "",
    cpf: registro.servidor.cpf,
    cargo: historico?.cargo.descricao ?? "",
    secretaria: historico?.departamento?.descricao ?? "",
    periodoAquisitivoInicio: dataResposta(registro.periodo_aquisitivo_inicio),
    periodoAquisitivoFim: dataResposta(registro.periodo_aquisitivo_fim),
    diasDireito: registro.dias_direito,
    inicio,
    fim,
    dias: registro.dias,
    abonoPecuniario: registro.abono_pecuniario,
    antecipacaoDecimoTerceiro: registro.antecipacao_decimo_terceiro,
    observacoes: registro.observacoes ?? "",
    situacao,
  };
}

function contarDias(inicio: string, fim: string): number {
  return Math.floor((dataBanco(fim).getTime() - dataBanco(inicio).getTime()) / 86400000) + 1;
}

function validarPeriodos(dados: FeriasCampos) {
  if (dados.periodoAquisitivoFim < dados.periodoAquisitivoInicio) {
    throw new AppError(422, "O fim do período aquisitivo deve ser posterior ao início.");
  }
  if (dados.fim < dados.inicio) {
    throw new AppError(422, "O fim das férias deve ser posterior ao início.");
  }
  if (contarDias(dados.inicio, dados.fim) > dados.diasDireito) {
    throw new AppError(422, "A quantidade de dias de férias não pode ser maior que os dias de direito.");
  }
}

export class FeriasService {
  async listar() {
    const registros = await prisma.ferias.findMany({
      include: incluirServidor,
      orderBy: [{ criado_em: "desc" }, { id_ferias: "desc" }],
    });
    return registros.map(formatar);
  }

  async listarPorServidor(servidorId: number) {
    await this.obterServidor(servidorId);
    const registros = await prisma.ferias.findMany({
      where: { servidor_id: servidorId },
      include: incluirServidor,
      orderBy: [{ criado_em: "desc" }, { id_ferias: "desc" }],
    });
    return registros.map(formatar);
  }

  async procurar(id: number) {
    const registro = await prisma.ferias.findUnique({
      where: { id_ferias: id },
      include: incluirServidor,
    });
    if (!registro) throw new RegistroNaoEncontradoError("Férias");
    return formatar(registro);
  }

  async criar(dados: FeriasDados) {
    validarPeriodos(dados);
    const servidor = await this.obterServidor(dados.servidorId);
    await this.validarSobreposicao(dados.servidorId, dados);

    const registro = await prisma.ferias.create({
      data: this.dadosBanco(
        dados,
        dados.servidorId,
        servidor.matriculas[0]?.id_matricula ?? null,
      ),
      include: incluirServidor,
    });
    return formatar(registro);
  }

  async atualizar(id: number, dados: FeriasCampos) {
    validarPeriodos(dados);
    const atual = await prisma.ferias.findUnique({ where: { id_ferias: id } });
    if (!atual) throw new RegistroNaoEncontradoError("Férias");
    if (atual.situacao === SituacaoFerias.CANCELADA) {
      throw new AppError(409, "Não é possível editar férias canceladas.");
    }

    await this.validarSobreposicao(atual.servidor_id, dados, id);
    const registro = await prisma.ferias.update({
      where: { id_ferias: id },
      data: {
        ...this.dadosBanco(dados, atual.servidor_id, atual.matricula_id),
        situacao: SituacaoFerias.APROVADA,
      },
      include: incluirServidor,
    });
    return formatar(registro);
  }

  async cancelar(id: number) {
    const atual = await prisma.ferias.findUnique({ where: { id_ferias: id } });
    if (!atual) throw new RegistroNaoEncontradoError("Férias");
    if (atual.situacao === SituacaoFerias.CANCELADA) {
      throw new AppError(409, "Estas férias já foram canceladas.");
    }

    const registro = await prisma.ferias.update({
      where: { id_ferias: id },
      data: {
        situacao: SituacaoFerias.CANCELADA,
        cancelado_em: new Date(),
      },
      include: incluirServidor,
    });
    return formatar(registro);
  }

  private async obterServidor(id: number) {
    const servidor = await prisma.servidor.findUnique({
      where: { id_servidor: id },
      select: {
        id_servidor: true,
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

  private async validarSobreposicao(servidorId: number, dados: FeriasCampos, ignorarId?: number) {
    const sobreposicao = await prisma.ferias.findFirst({
      where: {
        servidor_id: servidorId,
        situacao: { not: SituacaoFerias.CANCELADA },
        inicio: { lte: dataBanco(dados.fim) },
        fim: { gte: dataBanco(dados.inicio) },
        ...(ignorarId ? { id_ferias: { not: ignorarId } } : {}),
      },
      select: { id_ferias: true },
    });
    if (sobreposicao) {
      throw new AppError(409, "Já existe um período de férias sobreposto para este servidor.");
    }
  }

  private dadosBanco(dados: FeriasCampos, servidorId: number, matriculaId: number | null) {
    return {
      servidor_id: servidorId,
      matricula_id: matriculaId,
      periodo_aquisitivo_inicio: dataBanco(dados.periodoAquisitivoInicio),
      periodo_aquisitivo_fim: dataBanco(dados.periodoAquisitivoFim),
      dias_direito: dados.diasDireito,
      inicio: dataBanco(dados.inicio),
      fim: dataBanco(dados.fim),
      dias: contarDias(dados.inicio, dados.fim),
      abono_pecuniario: dados.abonoPecuniario,
      antecipacao_decimo_terceiro: dados.antecipacaoDecimoTerceiro,
      observacoes: dados.observacoes || null,
      situacao: SituacaoFerias.APROVADA,
    };
  }
}
