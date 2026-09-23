import { PermissaoUsuario } from "../../generated/prisma/enums.js";
import { prisma } from "../lib/prisma.js";
import { AutorizacoesDominio } from "../types/dominio.types.js";

const autorizacoesPadrao: AutorizacoesDominio = {
    listar: [PermissaoUsuario.ADMIN, PermissaoUsuario.RH],
    procurar: [PermissaoUsuario.ADMIN, PermissaoUsuario.RH],
    adicionar: [PermissaoUsuario.ADMIN],
    atualizar: [PermissaoUsuario.ADMIN],
    deletar: [PermissaoUsuario.ADMIN]
};

export const dominiosConfig = {
    comunidadeIndigena: {
        prismaModel: prisma.comunidadeIndigena,
        nome: "Comunidade Indígena",
        rota: "comunidadesIndigenas",
        idField: "id_comunidade_indigena",
        verificacoesUso: [],
        limiteDescricao: 50
    },
    escolaridade: {
        prismaModel: prisma.escolaridade,
        nome: "Escolaridade",
        rota: "escolaridade",
        idField: "id_escolaridade",
        verificacoesUso: [],
        limiteDescricao: 50
    },
    genero: {
        prismaModel: prisma.genero,
        nome: "Gênero",
        rota: "generos",
        idField: "id_genero",
        verificacoesUso: [],
        limiteDescricao: 20
    },
    racaCor: {
        prismaModel: prisma.racaCor,
        nome: "Raça/Cor",
        rota: "racaCor",
        idField: "id_racacor",
        verificacoesUso: [],
        limiteDescricao: 10
    },
    sexo: {
        prismaModel: prisma.sexo,
        nome: "Sexo",
        rota: "sexos",
        idField: "id_sexo",
        verificacoesUso: [],
        limiteDescricao: 10
    },
    nivel: {
        prismaModel: prisma.nivel,
        nome: "Nível",
        rota: "nivel",
        idField: "id_nivel",
        verificacoesUso: [],
        limiteDescricao: 10
    },
    estadoCivil: {
        prismaModel: prisma.estadoCivil,
        nome: "Estado Civíl",
        rota: "estadoCivil",
        idField: "id_nivel",
        verificacoesUso: [],
        limiteDescricao: 15
    },
    zonaEndereco: {
        prismaModel: prisma.zonaEndereco,
        nome: "Zona",
        rota: "zonaEndereco",
        idField: "id_zona_endereco",
        verificacoesUso: [],
        limiteDescricao: 10
    },
    localizacaoDiferenciada: {
        prismaModel: prisma.localizacaoDiferenciada,
        nome: "Localização",
        rota: "localizacaoDiferenciada",
        idField: "id_localizacao_diferenciada",
        verificacoesUso: [],
        limiteDescricao: 50
    },
    cargo: {
        prismaModel: prisma.cargo,
        nome: "Cargo",
        rota: "cargo",
        idField: "id_cargo",
        verificacoesUso: [],
        limiteDescricao: 50
    },
    funcao: {
        prismaModel: prisma.funcao,
        nome: "Funcao",
        rota: "funcao",
        idField: "id_funcao",
        verificacoesUso: [],
        limiteDescricao: 50
    },
    departamento: {
        prismaModel: prisma.departamento,
        nome: "Departamento",
        rota: "departamento",
        idField: "id_departamento",
        verificacoesUso: [],
        limiteDescricao: 50
    },
    tipoVinculo: {
        prismaModel: prisma.tipoVinculo,
        nome: "Tipo de Vínculo",
        rota: "tipoVinculo",
        idField: "id_funcao",
        verificacoesUso: [],
        limiteDescricao: 50
    },
    tipoEnsinoMedioCursado: {
        prismaModel: prisma.tipoEnsinoMedioCursado,
        nome: "Funcao",
        rota: "tipoEnsinoMedioCursado",
        idField: "id_tipo_ensino_medio_cursado",
        verificacoesUso: [],
        limiteDescricao: 50
    },
    situacao: {
        prismaModel: prisma.situacao,
        nome: "Situação",
        rota: "situacao",
        idField: "id_situacao",
        verificacoesUso: [],
        limiteDescricao: 30
    },
}