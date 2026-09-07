import { NextFunction, Request, Response } from "express";
import Jwt from "jsonwebtoken";
import { NaoAutorizado, TokenInvalidoOuExpirado, TokenNaoFornecido } from "../errors/auth.erros.js";

declare global {
    namespace Express {
        interface Request {
            usuario?: string | Jwt.JwtPayload;
        }
    }
}

export function autenticar(req: Request, res: Response, next: NextFunction) {

    const authHeader = req.headers.authorization

    console.log(authHeader)

    if (!authHeader) {
        throw new TokenNaoFornecido()
    }

    const token = authHeader.split(' ')[1]

    try {
        const payload = Jwt.verify(token, process.env.JWT_SECRET!);

        req.usuario = payload;

        next(); // libera passagem
    } catch (erro) {
        throw new TokenInvalidoOuExpirado();
    }
}

export function autorizar(...permissoesPermitidas: any[]){

    return (req:Request, res:Response, next:NextFunction)=>{
        const usuario = req.usuario

        if (!usuario || typeof usuario === "string" || !("permissao" in usuario)) {
            throw new NaoAutorizado()
        }

        const { permissao } = usuario

        if(!permissoesPermitidas.includes(permissao)){
            throw new NaoAutorizado()
        }

        next()
    }

}