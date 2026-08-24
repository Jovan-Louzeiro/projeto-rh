import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";

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