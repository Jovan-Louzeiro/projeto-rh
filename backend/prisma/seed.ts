import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import {gerarHash} from "../src/utils/senha.js"

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!
})

const prisma = new PrismaClient({ adapter });

async function main() {
    await prisma.sexo.createMany({
        data: [
            { descricao: "M" },
            { descricao: "F" },
            { descricao: "I" }
        ], skipDuplicates: true
    })

    await prisma.genero.createMany({
        data: [
            { descricao: "Homem" },
            { descricao: "Mulher" },
            { descricao: "Não Binário" },
            { descricao: "Outro" },
            { descricao: "Prefiro não informar" }
        ], skipDuplicates: true
    })

    await prisma.racaCor.createMany({
        data: [
            { descricao: "Branca" },
            { descricao: "Preta" },
            { descricao: "Parda" },
            { descricao: "Amarela" },
            { descricao: "Indígena" }
        ], skipDuplicates: true
    })

    await prisma.escolaridade.createMany({
        data: [
            { descricao: "Ensino Fundamental" },
            { descricao: "Ensino Médio" },
            { descricao: "Superior" },
            { descricao: "Pós-Graduação" },
            { descricao: "Doutorado" }
        ], skipDuplicates: true
    })

    await prisma.estadoCivil.createMany({
        data: [
            { descricao: "Solteiro(a)" },
            { descricao: "Casado(a)" },
            { descricao: "Divorciado(a)" },
            { descricao: "Viúvo(a)" },
        ], skipDuplicates: true
    })

    await prisma.pais.createMany({
        data: [
            { nome: "Brasil", gentilico: "Brasileiro(a)", codigo_iso: "BR" },
            { nome: "Argentina", gentilico: "Argentino(a)", codigo_iso: "AR" },
            { nome: "Chile", gentilico: "Chileno(a)", codigo_iso: "CL" },
            { nome: "Colômbia", gentilico: "Colombiano(a)", codigo_iso: "CO" },
            { nome: "Peru", gentilico: "Peruano(a)", codigo_iso: "PE" },
            { nome: "Uruguai", gentilico: "Uruguaio(a)", codigo_iso: "UY" },
            { nome: "Venezuela", gentilico: "Venezuelano(a)", codigo_iso: "VE" },
            { nome: "Paraguai", gentilico: "Paraguaio(a)", codigo_iso: "PY" },
            { nome: "Bolívia", gentilico: "Boliviano(a)", codigo_iso: "BO" },
            { nome: "Equador", gentilico: "Equatoriano(a)", codigo_iso: "EC" },
            { nome: "Guiana", gentilico: "Guianense", codigo_iso: "GY" },
            { nome: "Suriname", gentilico: "Surinamense", codigo_iso: "SR" },
            { nome: "Guiana Francesa", gentilico: "Franceses da Guiana", codigo_iso: "GF" },
        ], skipDuplicates: true
    })

    const id_brasil = await prisma.pais.findUnique({
        where: { nome: "Brasil" },
        select: { id_pais: true }
    })

    if(!id_brasil) {
        throw new Error("País Brasil não encontrado no banco de dados.")
    }

    await prisma.estado.createMany({
        data: [
            { nome: "Acre", uf: "AC", pais_id: id_brasil.id_pais },
            { nome: "Alagoas", uf: "AL", pais_id: id_brasil.id_pais },
            { nome: "Amapá", uf: "AP", pais_id: id_brasil.id_pais },
            { nome: "Amazonas", uf: "AM", pais_id: id_brasil.id_pais },
            { nome: "Bahia", uf: "BA", pais_id: id_brasil.id_pais },
            { nome: "Ceará", uf: "CE", pais_id: id_brasil.id_pais },
            { nome: "Distrito Federal", uf: "DF", pais_id: id_brasil.id_pais },
            { nome: "Espírito Santo", uf: "ES", pais_id: id_brasil.id_pais },
            { nome: "Goiás", uf: "GO", pais_id: id_brasil.id_pais },
            { nome: "Maranhão", uf: "MA", pais_id: id_brasil.id_pais },
            { nome: "Mato Grosso", uf: "MT", pais_id: id_brasil.id_pais },
            { nome: "Mato Grosso do Sul", uf: "MS", pais_id: id_brasil.id_pais },
            { nome: "Minas Gerais", uf: "MG", pais_id: id_brasil.id_pais },
            { nome: "Pará", uf: "PA", pais_id: id_brasil.id_pais },
            { nome: "Paraíba", uf: "PB", pais_id: id_brasil.id_pais },
            { nome: "Paraná", uf: "PR", pais_id: id_brasil.id_pais },
            { nome: "Pernambuco", uf: "PE", pais_id: id_brasil.id_pais },
            { nome: "Piauí", uf: "PI", pais_id: id_brasil.id_pais },
            { nome: "Rio de Janeiro", uf: "RJ", pais_id: id_brasil.id_pais },
            { nome: "Rio Grande do Norte", uf: "RN", pais_id: id_brasil.id_pais },
            { nome: "Rio Grande do Sul", uf: "RS", pais_id: id_brasil.id_pais },
            { nome: "Rondônia", uf: "RO", pais_id: id_brasil.id_pais },
            { nome: "Roraima", uf: "RR", pais_id: id_brasil.id_pais },
            { nome: "Santa Catarina", uf: "SC", pais_id: id_brasil.id_pais },
            { nome: "São Paulo", uf: "SP", pais_id: id_brasil.id_pais },
            { nome: "Sergipe", uf: "SE", pais_id: id_brasil.id_pais },
            { nome: "Tocantins", uf: "TO", pais_id: id_brasil.id_pais }
        ], skipDuplicates: true
    })

    const id_maranhao = await prisma.estado.findUnique({
        where: { uf: "MA" },
        select: { id_estado: true }
    })

    if(!id_maranhao) {
        throw new Error("Estado Maranhão não encontrado no banco de dados.")
    }

    await prisma.municipio.createMany({
        data: [
            { nome: "Carutapera", estado_id: id_maranhao.id_estado }
        ], skipDuplicates: true
    })

    await prisma.zonaEndereco.createMany({
        data: [
            { descricao: "Urbana" },
            { descricao: "Rural" }
        ], skipDuplicates: true
    })

    await prisma.tipoVinculo.createMany({
        data: [
            { descricao: "Efetivo" },
            { descricao: "Contratado" },
            { descricao: "Comissionado"}
        ], skipDuplicates: true
    })

    await prisma.tipoEnsinoMedioCursado.createMany({
        data: [
            { descricao: "Regular" },
            { descricao: "EJA" },
            { descricao: "Técnico" }
        ], skipDuplicates: true
    })

    await prisma.situacao.createMany({
        data: [
            { descricao: "Ativo" },
            { descricao: "Inativo" },
            { descricao: "Exonerado" },
            { descricao: "Aposentado" },
            { descricao: "Falecido" }
    ], skipDuplicates: true
    })

    await prisma.nacionalidade.createMany({
        data: [
            { descricao: "Brasileira" },
            { descricao: "Naturalizada" }
        ], skipDuplicates: true
    })

    await prisma.usuario.createMany({
        data: [
            {nome: "Jovan Louzeiro", email: "jovan.louzeiro@gmail.com", senha: await gerarHash("2008"), ativo: true, permissao: "ADMIN"},
            {nome: "Matheus Duarte", email: "matheus.jovan@gmail.com", senha: await gerarHash("2026"), ativo: true, permissao: "ADMIN"}
        ],
        skipDuplicates: true
    })
    
}


main()
.then(async () => {
    await prisma.$disconnect()
})
.catch(async (e) => {
    console.log(e)
    await prisma.$connect()
    process.exit(1)
})