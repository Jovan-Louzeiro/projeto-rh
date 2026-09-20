import { loginService } from "../services/auth.service.js";
import { Response, Request } from "express";


export async function login(req:Request, res:Response) {
    
    const {email, senha} = req.body

    const token = await loginService(email, senha)

    res.status(200).json({
        mensagem: "Login Realizado com Sucesso",
        token: token
    })

}