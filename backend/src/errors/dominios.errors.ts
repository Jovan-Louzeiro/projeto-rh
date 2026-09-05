export class RegistroJaExistenteError extends Error {
    constructor(entidade: string){
        super(`${entidade} informado já está cadastrado.`)
        this.name = "REGISTRO_EXISTENTE_ERRO"
    }
}

export class RegistroNaoEncontradoError extends Error {
    constructor(entidade: string){
        super(`${entidade} não encontrado.`)
        this.name = "REGISTRO_NAO_ENCONTRADO_ERRO"
    }
}

export class RegistroEmUso extends Error{
    constructor(entidade: string, quantidade: number){
        super(`${entidade} não pode ser deletado, pois existem ${quantidade} dependencias.`)
        this.name = "REGISTRO_EM_USO_ERRO"
    }
}