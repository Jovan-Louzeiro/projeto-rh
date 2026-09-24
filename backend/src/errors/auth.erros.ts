import { AppError } from "./app.errors.js"

export class EmailOuSenhaInvalidos extends AppError{
    constructor(){
        super(401, "Email ou Senha Inválidos")
    }
}

export class UsuarioInativo extends AppError{
    constructor(){
        super(403, "O usuário não está ativo")
    }
}

export class TokenNaoFornecido extends AppError{
    constructor(){
        super(401, "Token não fornecido")
    }
}

export class TokenInvalidoOuExpirado extends AppError{
    constructor(){
        super(401, "Token invalido ou expirado")
    }
}

export class NaoAutorizado extends AppError{
    constructor(){
        super(403, "Você não tem permissão para esta ação")
    }
}