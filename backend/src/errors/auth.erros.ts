export class EmailOuSenhaInvalidos extends Error{
    public readonly status: number
    constructor(){
        super("Email ou Senha Inválidos")
        this.name = "EMAIL_OU_SENHA_INVALIDOS_ERRO"
        this.status = 401
    }
}

export class UsuarioInativo extends Error{
    public readonly status: number
    constructor(){
        super("O usuário não está ativo")
        this.name = "USUARIO_INATIVO_ERRO"
        this.status = 403
    }
}

export class TokenNaoFornecido extends Error{
    public readonly status: number
    constructor(){
        super("Token não fornecido")
        this.name = "TOKEN_NAO_FORNECIDO_ERRO"
        this.status = 401
    }
}

export class TokenInvalidoOuExpirado extends Error{
    public readonly status: number
    constructor(){
        super("Token invalido ou expirado")
        this.name = "TOKEN_INVALIDO_OU_EXPIRADO_ERRO"
        this.status = 401
    }
}

export class NaoAutorizado extends Error{
    public readonly status: number
    constructor(){
        super("Você não tem permissão para esta ação")
        this.name = "NAO_AUTORIZADO_ERRO"
        this.status = 403
    }
}