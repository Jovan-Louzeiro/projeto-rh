import { assert } from "node:console";
import { Prisma } from "./generated/prisma/client.js";
import { prisma } from "./lib/prisma.js";

async function add_servidor(data: Prisma.servidoresCreateInput) {
    await prisma.servidores.create({data})
}

const resultado = await add_servidor({
        matricula: "123456",
        nome_completo: "Jovan Louzeiro",
        cpf: "60461515385",
        rg: "60461515385",
        data_nascimento: new Date("2008-06-21"),
        nome_mae: "Hilda Maria Seleiro Louzeiro",
        sexo: "MASCULINO",
        genero: "HOMEM",
        racacor: "PARDA",
        escolaridade: "MEDIO_INCOMPLETO",
        nivel: "NIVEL1"
})

console.log(resultado)