import bcrypt from "bcrypt"

export async function gerarHash(senha:string) {

    return bcrypt.hash(senha, 10)
    
}

export async function compararSenha(senha:string, hash:string) {
    return bcrypt.compare(senha, hash)    
}