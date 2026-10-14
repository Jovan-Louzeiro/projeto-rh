import { UsuariosSchemas } from "./usuario.schema.js";

const schemas = new UsuariosSchemas();

console.log(
    "Senha:",
    schemas.adicionar.shape.senha.safeParse(undefined)
);

console.log(
    "Nome:",
    schemas.adicionar.shape.nome.safeParse(undefined)
);

console.log(
    "Schema completo:",
    schemas.adicionar.safeParse({
        nome: undefined,
        email: undefined,
        senha: undefined,
        permissao: undefined,
        ativo: undefined,
    })
);