import { Prisma } from "../../generated/prisma/client.js";

import {
    RegistroEmUso,
    RegistroJaExistenteError,
    RegistroNaoEncontradoError
} from "./dominios.errors.js";

export function tratarErroPrisma(error: unknown): never {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
        switch (error.code) {

            case "P2002": {
                const meta = error.meta as {
                    driverAdapterError?: {
                        cause?: {
                            constraint?: {
                                fields?: string[];
                            };
                        };
                    };
                } | undefined;

                const campos =
                    meta?.driverAdapterError?.cause?.constraint?.fields;

                const campo = campos?.join(", ") ?? "campo informado";

                throw new RegistroJaExistenteError(campo);
            }

            case "P2025":
                throw new RegistroNaoEncontradoError("Registro");


            case "P2003":
                throw new RegistroEmUso("Registro")

            default:
                throw error;
        }
    }

    throw error;
}