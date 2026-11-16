import type { Prisma } from "#/generated/prisma/client.js";
import { prisma } from "@/lib/prisma.js";
import { AppError } from "@/errors/app.errors.js";
import { RegistroNaoEncontradoError } from "@/errors/dominios.errors.js";
import {
    RequerimentoInput,
    RequerimentoDadosHistoricos,
    SituacaoRequerimento,
    TIPOS_REQUERIMENTO,
} from "@/modules/documentos/schemas/requerimento.schema.js";
import { gerarRequerimento as gerarDocumento } from "@/modules/documentos/utils/gerarRequerimento.docx.js";
import { gerarRequerimentoPdf } from "@/modules/documentos/utils/gerarRequerimento.pdf.js";
import { CRUDServices } from "@/services/crud.service.js";

type ArquivoAnexo = {
    originalname: string;
    mimetype: string;
    size: number;
    buffer: Buffer;
};

type RegistroCarregado = Prisma.RequerimentoGetPayload<{
    include: {
        tipo_requerimento: true;
        anexos: {
            select: {
                id_anexo_requerimento: true;
                nome: true;
                tipo: true;
                tamanho: true;
                enviado_em: true;
                assinado: true;
            };
        };
    };
}>;

function objeto(valor: Prisma.JsonValue | null): Record<string, unknown> {
    return valor && typeof valor === "object" && !Array.isArray(valor)
        ? valor as Record<string, unknown>
        : {};
}

function texto(valor: unknown, padrao = ""): string {
    if (typeof valor === "string") return valor;
    if (typeof valor === "number") return String(valor);
    return padrao;
}

function dataIso(valor: unknown): string {
    if (valor instanceof Date && !Number.isNaN(valor.getTime())) {
        return valor.toISOString().slice(0, 10);
    }
    return texto(valor).slice(0, 10);
}

function dataHoje(): string {
    const partes = new Intl.DateTimeFormat("en-CA", {
        timeZone: "America/Sao_Paulo",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    }).formatToParts(new Date());
    const valores = Object.fromEntries(partes.map(parte => [parte.type, parte.value]));
    return `${valores.year}-${valores.month}-${valores.day}`;
}

function criarAnexos(arquivos: ArquivoAnexo[]) {
    return arquivos.map(arquivo => ({
        nome: arquivo.originalname.slice(0, 255),
        tipo: arquivo.mimetype,
        tamanho: arquivo.size,
        conteudo: new Uint8Array(arquivo.buffer),
    }));
}

export class requerimentoService extends CRUDServices<RequerimentoInput, RequerimentoInput> {
    constructor() {
        super(prisma.requerimento, "Requerimento", "id_requerimento");
    }

    private readonly incluir = {
        tipo_requerimento: true,
        anexos: {
            select: {
                id_anexo_requerimento: true,
                nome: true,
                tipo: true,
                tamanho: true,
                enviado_em: true,
                assinado: true,
            },
        },
    } as const satisfies Prisma.RequerimentoInclude;

    private async carregar(id: number): Promise<RegistroCarregado> {
        const registro = await prisma.requerimento.findUnique({
            where: { id_requerimento: id },
            include: this.incluir,
        });
        if (!registro) throw new RegistroNaoEncontradoError("Requerimento");
        return registro;
    }

    private formatar(registro: RegistroCarregado) {
        const dados = objeto(registro.dados_historicos);
        const tipos = Array.isArray(dados.tipos)
            ? dados.tipos.filter((item): item is string => typeof item === "string")
            : [registro.tipo_requerimento.descricao];
        const assinatura = objeto(dados.assinatura as Prisma.JsonValue);
        const historico = Array.isArray(dados.historico) ? dados.historico : [];
        const anexos = registro.anexos.map(anexo => ({
            id: String(anexo.id_anexo_requerimento),
            nome: anexo.nome,
            tipo: anexo.tipo,
            tamanho: anexo.tamanho,
            enviadoEm: anexo.enviado_em.toISOString(),
            assinado: anexo.assinado,
            url: `/api/requerimentos/${registro.id_requerimento}/anexos/${anexo.id_anexo_requerimento}`,
        }));

        return {
            id: String(registro.id_requerimento),
            protocolo: registro.numero_protocolo,
            dataEntrada: texto(dados.data_entrada, dataIso(registro.criado_em)),
            servidorId: String(registro.servidor_id),
            matriculaId: String(registro.matricula_id),
            servidor: texto(dados.nome_completo),
            matricula: texto(dados.matricula_numero),
            cpf: texto(dados.cpf) || undefined,
            cargo: texto(dados.cargo_descricao),
            secretaria: texto(dados.departamento_descricao),
            lotacao: texto(dados.departamento_descricao),
            dataAdmissao: texto(dados.admissao_matricula) || undefined,
            endereco: texto(dados.endereco_logradouro) || undefined,
            numeroEndereco: texto(dados.numero_endereco) || undefined,
            bairro: texto(dados.bairro_endereco) || undefined,
            cidade: texto(dados.cidade_endereco) || undefined,
            telefone: texto(dados.telefone) || undefined,
            tipos,
            outroEspecificacao: texto(dados.outro_especificacao) || undefined,
            justificativa: texto(dados.justificativa),
            anexos,
            situacao: texto(dados.situacao, "Pendente"),
            responsavel: texto(dados.responsavel) || undefined,
            assinatura: {
                aceite: assinatura.aceite === true,
                dataHora: texto(assinatura.dataHora) || undefined,
                usuario: texto(assinatura.usuario) || undefined,
                ip: texto(assinatura.ip) || undefined,
            },
            historico,
        };
    }

    async listarRequerimentos(filtros: {
        busca?: string;
        situacao?: SituacaoRequerimento;
        tipo?: string;
        servidorId?: number;
        dataInicial?: string;
        dataFinal?: string;
    }) {
        const registros = await prisma.requerimento.findMany({
            where: filtros.servidorId ? { servidor_id: filtros.servidorId } : undefined,
            include: this.incluir,
            orderBy: { criado_em: "desc" },
        });
        const requerimentos = registros.map(registro => this.formatar(registro));
        const busca = filtros.busca?.trim().toLocaleLowerCase();

        return requerimentos.filter(item => {
            const textoBusca = `${item.protocolo} ${item.servidor} ${item.matricula} ${item.tipos.join(" ")}`
                .toLocaleLowerCase();
            return (!busca || textoBusca.includes(busca))
                && (!filtros.situacao || item.situacao === filtros.situacao)
                && (!filtros.tipo || item.tipos.includes(filtros.tipo))
                && (!filtros.dataInicial || item.dataEntrada >= filtros.dataInicial)
                && (!filtros.dataFinal || item.dataEntrada <= filtros.dataFinal);
        });
    }

    async procurarRequerimento(id: number) {
        return this.formatar(await this.carregar(id));
    }

    private async montarDadosServidor(
        dados: RequerimentoInput,
        usuario: string,
        ip: string | undefined,
    ) {
        const servidor = await prisma.servidor.findUnique({
            where: { id_servidor: dados.servidorId },
            include: {
                municipio_endereco: true,
                contatos: {
                    where: {
                        ativo: true,
                        tipo_contato: { in: ["TELEFONE_MOVEL", "TELEFONE_FIXO"] },
                    },
                    orderBy: [{ principal: "desc" }, { id_contato: "asc" }],
                },
                matriculas: {
                    where: { id_matricula: dados.matriculaId },
                    include: {
                        historicos_funcionais: {
                            where: { data_fim: null },
                            orderBy: { data_inicio: "desc" },
                            take: 1,
                            include: { cargo: true, funcao: true, departamento: true },
                        },
                    },
                },
            },
        });

        if (!servidor) throw new RegistroNaoEncontradoError("Servidor");
        const matricula = servidor.matriculas[0];
        if (!matricula) {
            throw new AppError(422, "A matrícula selecionada não pertence ao servidor.");
        }

        const funcional = matricula.historicos_funcionais[0];
        const agora = new Date().toISOString();
        const telefone = servidor.contatos[0]?.contato ?? "";

        return {
            data_entrada: dataHoje(),
            nome_completo: dados.nomeCompleto?.trim() || servidor.nome_completo,
            matricula_numero: matricula.numero,
            admissao_matricula: dataIso(matricula.admissao),
            cargo_descricao: funcional?.cargo.descricao ?? "",
            funcao_descricao: funcional?.funcao?.descricao ?? "",
            departamento_descricao: funcional?.departamento?.descricao ?? "",
            endereco_logradouro: servidor.logradouro,
            numero_endereco: servidor.numero ?? "",
            bairro_endereco: servidor.bairro,
            cidade_endereco: servidor.municipio_endereco.nome,
            telefone,
            cpf: servidor.cpf,
            tipos: dados.tipos,
            outro_especificacao: dados.tipos.includes("Outros")
                ? dados.outroEspecificacao?.trim() ?? ""
                : "",
            justificativa: dados.justificativa.trim(),
            situacao: "Pendente" as SituacaoRequerimento,
            responsavel: usuario,
            assinatura: {
                aceite: true,
                dataHora: agora,
                usuario,
                ...(ip ? { ip } : {}),
            },
            historico: [{
                id: crypto.randomUUID(),
                dataHora: agora,
                situacaoNova: "Pendente" as SituacaoRequerimento,
                responsavel: usuario,
                observacao: "Requerimento criado.",
            }],
        } satisfies Prisma.InputJsonObject;
    }

    async cadastrarRequerimento(
        dados: RequerimentoInput,
        arquivos: ArquivoAnexo[],
        usuario: string,
        ip?: string,
    ) {
        if (!/^\d{1,4}\/\d{4}$/.test(dados.protocolo)) {
            throw new AppError(400, "Informe até quatro dígitos, barra e ano com quatro dígitos. Exemplo: 0001/2026.");
        }

        const protocoloExistente = await prisma.requerimento.findUnique({
            where: { numero_protocolo: dados.protocolo },
            select: { id_requerimento: true },
        });
        if (protocoloExistente) {
            throw new AppError(409, "O protocolo informado já está em uso.");
        }

        const dadosHistoricos = await this.montarDadosServidor(dados, usuario, ip);

        const registro = await prisma.$transaction(async transacao => {
            const descricao = dados.tipos[0];
            let tipo = await transacao.tipoRequerimento.findFirst({ where: { descricao } });
            if (!tipo) {
                tipo = await transacao.tipoRequerimento.create({ data: { descricao } });
            }

            return transacao.requerimento.create({
                data: {
                    numero_protocolo: dados.protocolo,
                    servidor_id: dados.servidorId,
                    matricula_id: dados.matriculaId,
                    tipo_requerimento_id: tipo.id_tipo_requerimento,
                    dados_historicos: dadosHistoricos,
                    anexos: { create: criarAnexos(arquivos) },
                },
                include: this.incluir,
            });
        });

        return this.formatar(registro);
    }

    async atualizarRequerimento(
        id: number,
        dados: RequerimentoInput,
        arquivos: ArquivoAnexo[],
        usuario: string,
        ip?: string,
    ) {
        const existente = await this.carregar(id);
        const dadosAtuais = objeto(existente.dados_historicos);
        const dadosServidor = await this.montarDadosServidor(dados, usuario, ip);
        const mesmaAssinatura = existente.servidor_id === dados.servidorId
            && existente.matricula_id === dados.matriculaId;

        const dadosHistoricos: Prisma.InputJsonObject = {
            ...dadosServidor,
            data_entrada: texto(dadosAtuais.data_entrada, dataIso(existente.criado_em)),
            situacao: texto(dadosAtuais.situacao, "Pendente"),
            responsavel: texto(dadosAtuais.responsavel, usuario),
            historico: Array.isArray(dadosAtuais.historico)
                ? dadosAtuais.historico as Prisma.InputJsonArray
                : [],
            assinatura: mesmaAssinatura && dadosAtuais.assinatura
                ? dadosAtuais.assinatura as Prisma.InputJsonValue
                : dadosServidor.assinatura,
        };

        const tipo = await prisma.tipoRequerimento.findFirst({
            where: { descricao: dados.tipos[0] },
        }) ?? await prisma.tipoRequerimento.create({
            data: { descricao: dados.tipos[0] },
        });

        const registro = await prisma.requerimento.update({
            where: { id_requerimento: id },
            data: {
                servidor_id: dados.servidorId,
                matricula_id: dados.matriculaId,
                tipo_requerimento_id: tipo.id_tipo_requerimento,
                dados_historicos: dadosHistoricos,
                anexos: { create: criarAnexos(arquivos) },
            },
            include: this.incluir,
        });

        return this.formatar(registro);
    }

    async alterarSituacao(
        id: number,
        situacao: SituacaoRequerimento,
        observacao: string,
        usuario: string,
    ) {
        const registro = await this.carregar(id);
        const dados = objeto(registro.dados_historicos);
        const atual = texto(dados.situacao, "Pendente") as SituacaoRequerimento;
        if (situacao === atual) return this.formatar(registro);

        const historicoAtual = Array.isArray(dados.historico)
            ? dados.historico as Prisma.InputJsonArray
            : [];
        const dadosAtualizados: Prisma.InputJsonObject = {
            ...dados,
            situacao,
            responsavel: usuario,
            historico: [
                ...historicoAtual,
                {
                    id: crypto.randomUUID(),
                    dataHora: new Date().toISOString(),
                    situacaoAnterior: atual,
                    situacaoNova: situacao,
                    responsavel: usuario,
                    observacao,
                },
            ],
        };

        const atualizado = await prisma.requerimento.update({
            where: { id_requerimento: id },
            data: { dados_historicos: dadosAtualizados },
            include: this.incluir,
        });
        return this.formatar(atualizado);
    }

    async obterHistorico(id: number) {
        const registro = await this.carregar(id);
        const dados = objeto(registro.dados_historicos);
        return Array.isArray(dados.historico) ? dados.historico : [];
    }

    async obterAnexo(id: number, anexoId: number) {
        const anexo = await prisma.requerimentoAnexo.findFirst({
            where: {
                id_anexo_requerimento: anexoId,
                requerimento_id: id,
            },
        });
        if (!anexo) throw new RegistroNaoEncontradoError("Anexo");
        return anexo;
    }

    async deletarAnexo(id: number, anexoId: number) {
        const anexo = await prisma.requerimentoAnexo.findFirst({
            where: {
                id_anexo_requerimento: anexoId,
                requerimento_id: id,
            },
            select: { id_anexo_requerimento: true },
        });
        if (!anexo) throw new RegistroNaoEncontradoError("Anexo");

        return prisma.requerimentoAnexo.delete({
            where: { id_anexo_requerimento: anexo.id_anexo_requerimento },
        });
    }

    async adicionarPdfAssinado(id: number, arquivo: ArquivoAnexo) {
        await this.carregar(id);
        const anexo = await prisma.requerimentoAnexo.create({
            data: {
                nome: arquivo.originalname.slice(0, 255),
                tipo: arquivo.mimetype,
                tamanho: arquivo.size,
                conteudo: new Uint8Array(arquivo.buffer),
                assinado: true,
                requerimento_id: id,
            },
        });

        return {
            id: String(anexo.id_anexo_requerimento),
            nome: anexo.nome,
            tipo: anexo.tipo,
            tamanho: anexo.tamanho,
            enviadoEm: anexo.enviado_em.toISOString(),
            assinado: anexo.assinado,
            url: `/api/requerimentos/${id}/anexos/${anexo.id_anexo_requerimento}`,
        };
    }

    async deletarRequerimento(id: number) {
        await this.carregar(id);
        return prisma.requerimento.delete({ where: { id_requerimento: id } });
    }

    private async dadosDocumento(id: number): Promise<RequerimentoDadosHistoricos> {
        const registro = await this.carregar(id);
        const dados = objeto(registro.dados_historicos);
        const tipos = Array.isArray(dados.tipos)
            ? dados.tipos.filter((item): item is string =>
                typeof item === "string" && TIPOS_REQUERIMENTO.includes(item as typeof TIPOS_REQUERIMENTO[number]))
            : [registro.tipo_requerimento.descricao];
        const assinatura = objeto(dados.assinatura as Prisma.JsonValue);
        const historico: RequerimentoDadosHistoricos = {
            numero_protocolo: registro.numero_protocolo,
            data_entrada: texto(dados.data_entrada, dataIso(registro.criado_em)),
            nome_completo: texto(dados.nome_completo),
            matricula_numero: texto(dados.matricula_numero),
            admissao_matricula: texto(dados.admissao_matricula),
            cargo_descricao: texto(dados.cargo_descricao),
            funcao_descricao: texto(dados.funcao_descricao),
            departamento_descricao: texto(dados.departamento_descricao),
            endereco_logradouro: texto(dados.endereco_logradouro),
            numero_endereco: texto(dados.numero_endereco),
            bairro_endereco: texto(dados.bairro_endereco),
            cidade_endereco: texto(dados.cidade_endereco),
            telefone: texto(dados.telefone),
            cpf: texto(dados.cpf),
            tipos: tipos as RequerimentoDadosHistoricos["tipos"],
            outro_especificacao: texto(dados.outro_especificacao),
            justificativa: texto(dados.justificativa),
            situacao: texto(dados.situacao, "Pendente") as SituacaoRequerimento,
            responsavel: texto(dados.responsavel),
            assinatura: {
                aceite: assinatura.aceite === true,
                dataHora: texto(assinatura.dataHora),
                usuario: texto(assinatura.usuario),
                ...(typeof assinatura.ip === "string" ? { ip: assinatura.ip } : {}),
            },
            historico: [],
        };
        return historico;
    }

    async gerarRequerimento(id: number) {
        return gerarDocumento({ data: await this.dadosDocumento(id) });
    }

    async gerarPdfRequerimento(id: number) {
        return gerarRequerimentoPdf({ data: await this.dadosDocumento(id) });
    }
}
