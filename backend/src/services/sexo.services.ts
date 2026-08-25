import { prisma } from "../lib/prisma.js";

export async function listarSexos() {
    return await prisma.sexo.findMany()
}