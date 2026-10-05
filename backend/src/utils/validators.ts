export function validarCpf(cpf: string): boolean {

    if (!/^\d{11}$/.test(cpf)) {
        return false
    }

    // Rejeita CPFs como 11111111111, 22222222222...
    if (/^(\d)\1{10}$/.test(cpf)) {
        return false
    }

    let soma = 0

    // Primeiro dígito
    for (let i = 0; i < 9; i++) {
        soma += Number(cpf[i]) * (10 - i)
    }

    let resto = soma % 11
    const digito1 = resto < 2 ? 0 : 11 - resto

    if (digito1 !== Number(cpf[9])) {
        return false
    }

    soma = 0

    // Segundo dígito
    for (let i = 0; i < 10; i++) {
        soma += Number(cpf[i]) * (11 - i)
    }

    resto = soma % 11
    const digito2 = resto < 2 ? 0 : 11 - resto

    return digito2 === Number(cpf[10])
}