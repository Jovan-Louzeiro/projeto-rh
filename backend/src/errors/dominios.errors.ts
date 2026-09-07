export class RegistroJaExistenteError extends Error {
    public readonly status: number
    constructor(entidade: string){
        super(`${entidade} informado já está cadastrado.`)
        this.name = "REGISTRO_EXISTENTE_ERRO"
        this.status = 409
    }
}

export class RegistroNaoEncontradoError extends Error {
    public readonly status: number
    constructor(entidade: string){
        super(`${entidade} não encontrado.`)
        this.name = "REGISTRO_NAO_ENCONTRADO_ERRO"
        this.status = 404
    }
}

export class RegistroEmUso extends Error{
    public readonly status: number
    constructor(entidade: string, quantidade: number){
        super(`${entidade} não pode ser deletado, pois existem ${quantidade} dependencias.`)
        this.name = "REGISTRO_EM_USO_ERRO"
        this.status = 409
    }
}