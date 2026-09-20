import jwt from "jsonwebtoken"
import { EmailOuSenhaInvalidos, UsuarioInativo } from "../errors/auth.erros.js";
import { prisma } from "../lib/prisma.js";
import { compararSenha } from "../utils/senha.js";

export async function loginService(email: string, senha: string) {

    const usuario = await prisma.usuario.findUnique({
        where: {
            email: email
        }
    })

    if (!usuario) {
        throw new EmailOuSenhaInvalidos()
    }

    if (!usuario.ativo) {
        throw new UsuarioInativo()
    }

    const senhaCorreta = await compararSenha(senha, usuario.senha)

    if (!senhaCorreta) {
        throw new EmailOuSenhaInvalidos()
    }

    const token = jwt.sign({
        id: usuario.id_usuario,
        permissao: usuario.permissao
    },
        process.env.JWT_SECRET!,
        { expiresIn: "8h" }
    )

    return token

}