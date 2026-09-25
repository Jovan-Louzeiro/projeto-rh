import { AppError } from "./app.errors.js"

export class RegistroJaExistenteError extends AppError {
    constructor(campo: string){
        super(409, `${campo} informado já está em uso.`)
    }
}

export class RegistroNaoEncontradoError extends AppError {
    constructor(entidade: string){
        super(404, `${entidade} não encontrado.`)
    }
}

export class RegistroEmUso extends AppError {
    constructor(entidade: string) {
        super(
            409,
            `${entidade} não pode ser deletado, pois está sendo utilizado.`
        )
    }
}