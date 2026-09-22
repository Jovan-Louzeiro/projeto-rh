# API Projeto RH

Documentação das rotas da API para uso no frontend.

## 🌐 URL base

```text
https://projeto-rh-sj48.onrender.com
```

Para ambiente local, os endpoints também podem ser acessados em:

```text
http://localhost:3000
```

---

## 🔐 Autenticação

A API exige autenticação em todas as rotas protegidas. O token deve ser enviado no header:

```http
Authorization: Bearer <token>
```

O token é retornado pela rota de login e deve ser guardado no frontend, por exemplo em localStorage ou sessionStorage.

### Login

```http
POST /api/login
Content-Type: application/json
```

Body:

```json
{
  "email": "seu@email.com",
  "senha": "sua_senha"
}
```

Resposta esperada:

```json
{
  "token": "eyJ...",
  "usuario": {
    "id": 1,
    "email": "seu@email.com",
    "permissao": "ADMIN"
  }
}
```

> Observação: a autenticação é validada com JWT e o middleware `autenticar` exige que o header seja enviado corretamente.

---

## ✅ Permissões

As permissões da aplicação são:

- `ADMIN`
- `RH`

Regras atuais da API:

- `GET /api/usuarios` e `GET /api/usuarios/:id` → `RH`, `ADMIN`
- `POST /api/usuarios` → `ADMIN`
- `PATCH /api/usuarios/:id` e `DELETE /api/usuarios/:id` → `ADMIN`
- Rotas de domínio:
  - `GET` e `GET /:id` → `RH`, `ADMIN`
  - `POST` → `ADMIN`
  - `PATCH` e `DELETE` → `ADMIN`

---

# 👤 Usuários

## GET `/api/usuarios`

Lista todos os usuários.

Headers:

```http
Authorization: Bearer <token>
```

Exemplo:

```bash
curl -X GET "https://projeto-rh-sj48.onrender.com/api/usuarios" \
  -H "Authorization: Bearer <token>"
```

---

## GET `/api/usuarios/:id`

Busca um usuário pelo ID.

Exemplo:

```bash
curl -X GET "https://projeto-rh-sj48.onrender.com/api/usuarios/1" \
  -H "Authorization: Bearer <token>"
```

---

## POST `/api/usuarios`

Cria um novo usuário.

Headers:

```http
Content-Type: application/json
Authorization: Bearer <token>
```

Body:

```json
{
  "nome": "João",
  "email": "joao@email.com",
  "senha": "123456",
  "permissao": "RH",
  "ativo": true
}
```

Campos:

- `nome`: string
- `email`: string
- `senha`: string
- `permissao`: `ADMIN` ou `RH`
- `ativo`: boolean (opcional)

---

## PATCH `/api/usuarios/:id`

Atualiza um usuário existente.

Body:

```json
{
  "nome": "João da Silva",
  "permissao": "ADMIN",
  "ativo": true
}
```

Exemplo:

```bash
curl -X PATCH "https://projeto-rh-sj48.onrender.com/api/usuarios/1" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "nome": "João da Silva",
    "permissao": "ADMIN"
  }'
```

---

## DELETE `/api/usuarios/:id`

Exclui um usuário.

Exemplo:

```bash
curl -X DELETE "https://projeto-rh-sj48.onrender.com/api/usuarios/1" \
  -H "Authorization: Bearer <token>"
```

---

# 📚 Domínios / Tabelas auxiliares

A API também expõe rotas genéricas de domínio, criadas dinamicamente a partir da configuração em `dominiosConfig`.

## Padrão de rota

```text
/api/<rota>
```

## Rotas disponíveis

A API não tem uma rota separada por "admin". O que existe é:

1. rotas de usuários (`/api/usuarios`)
2. rotas de domínio (`/api/<entidade>`) para as tabelas auxiliares

### Rotas de domínio disponíveis

| Entidade | Rota base | Operações |
| --- | --- | --- |
| Comunidades indígenas | `/api/comunidadesIndigenas` | `GET`, `GET /:id`, `POST`, `PATCH /:id`, `DELETE /:id` |
| Escolaridade | `/api/escolaridade` | `GET`, `GET /:id`, `POST`, `PATCH /:id`, `DELETE /:id` |
| Gêneros | `/api/generos` | `GET`, `GET /:id`, `POST`, `PATCH /:id`, `DELETE /:id` |
| Raça/Cor | `/api/racaCor` | `GET`, `GET /:id`, `POST`, `PATCH /:id`, `DELETE /:id` |
| Sexos | `/api/sexos` | `GET`, `GET /:id`, `POST`, `PATCH /:id`, `DELETE /:id` |
| Níveis | `/api/nivel` | `GET`, `GET /:id`, `POST`, `PATCH /:id`, `DELETE /:id` |
| Estado civil | `/api/estadoCivil` | `GET`, `GET /:id`, `POST`, `PATCH /:id`, `DELETE /:id` |
| Zona de endereço | `/api/zonaEndereco` | `GET`, `GET /:id`, `POST`, `PATCH /:id`, `DELETE /:id` |
| Localização diferenciada | `/api/localizacaoDiferenciada` | `GET`, `GET /:id`, `POST`, `PATCH /:id`, `DELETE /:id` |
| Cargo | `/api/cargo` | `GET`, `GET /:id`, `POST`, `PATCH /:id`, `DELETE /:id` |
| Função | `/api/funcao` | `GET`, `GET /:id`, `POST`, `PATCH /:id`, `DELETE /:id` |
| Departamento | `/api/departamento` | `GET`, `GET /:id`, `POST`, `PATCH /:id`, `DELETE /:id` |
| Tipo de vínculo | `/api/tipoVinculo` | `GET`, `GET /:id`, `POST`, `PATCH /:id`, `DELETE /:id` |
| Tipo ensino médio cursado | `/api/tipoEnsinoMedioCursado` | `GET`, `GET /:id`, `POST`, `PATCH /:id`, `DELETE /:id` |
| Situação | `/api/situacao` | `GET`, `GET /:id`, `POST`, `PATCH /:id`, `DELETE /:id` |

### Rotas de usuários

| Rota | Operações |
| --- | --- |
| `/api/usuarios` | `GET`, `POST` |
| `/api/usuarios/:id` | `GET`, `PATCH`, `DELETE` |
| `/api/login` | `POST` |

> O “admin” não é uma rota em si; ele é um papel de permissão (`ADMIN`) que autoriza acesso a determinados endpoints.

### Operações por domínio

#### `GET /api/<rota>`

Lista os registros ativos do domínio, ou todos quando `mostrarTudo=true`.

Exemplo:

```bash
curl -X GET "https://projeto-rh-sj48.onrender.com/api/sexos?mostrarTudo=true" \
  -H "Authorization: Bearer <token>"
```

#### `GET /api/<rota>/:id`

Busca um registro pelo identificador.

#### `POST /api/<rota>`

Cria um novo registro do domínio.

Body:

```json
{
  "descricao": "Masculino",
  "ativo": true
}
```

#### `PATCH /api/<rota>/:id`

Atualiza um registro do domínio.

Body:

```json
{
  "descricao": "Feminino",
  "ativo": true
}
```

#### `DELETE /api/<rota>/:id`

Exclui um registro do domínio.

---

## Exemplo de domínio: sexos

### GET `/api/sexos`

```bash
curl -X GET "https://projeto-rh-sj48.onrender.com/api/sexos" \
  -H "Authorization: Bearer <token>"
```

### GET `/api/sexos/:id`

```bash
curl -X GET "https://projeto-rh-sj48.onrender.com/api/sexos/1" \
  -H "Authorization: Bearer <token>"
```

### POST `/api/sexos`

```bash
curl -X POST "https://projeto-rh-sj48.onrender.com/api/sexos" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "descricao": "Masculino",
    "ativo": true
  }'
```

### PATCH `/api/sexos/:id`

```bash
curl -X PATCH "https://projeto-rh-sj48.onrender.com/api/sexos/1" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "descricao": "Feminino"
  }'
```

### DELETE `/api/sexos/:id`

```bash
curl -X DELETE "https://projeto-rh-sj48.onrender.com/api/sexos/1" \
  -H "Authorization: Bearer <token>"
```

---

# 📋 Resumo das rotas principais

| Método | Endpoint | Auth | Descrição |
| --- | --- | --- | --- |
| `POST` | `/api/login` | ❌ | Realiza login |
| `GET` | `/api/usuarios` | ✅ | Lista usuários |
| `GET` | `/api/usuarios/:id` | ✅ | Busca usuário por ID |
| `POST` | `/api/usuarios` | ✅ | Cria usuário |
| `PATCH` | `/api/usuarios/:id` | ✅ | Atualiza usuário |
| `DELETE` | `/api/usuarios/:id` | ✅ | Remove usuário |
| `GET` | `/api/<rota>` | ✅ | Lista registros do domínio |
| `GET` | `/api/<rota>/:id` | ✅ | Busca registro do domínio |
| `POST` | `/api/<rota>` | ✅ | Cria registro do domínio |
| `PATCH` | `/api/<rota>/:id` | ✅ | Atualiza registro do domínio |
| `DELETE` | `/api/<rota>/:id` | ✅ | Remove registro do domínio |

---

# 🧩 Observações importantes para o frontend

- O frontend deve enviar o token em todas as rotas autenticadas.
- O token recebido no login deve ser salvo no armazenamento do navegador.
- As rotas de domínio seguem o mesmo padrão CRUD para todos os registros auxiliares.
- O backend aceita CORS para:
  - `https://projeto-rh-sj48.onrender.com`
  - `http://localhost:3000`
  - `http://localhost:5173`

---

# ⚠️ Segurança

- Nunca commitar tokens reais.
- Não expor segredo de JWT no código do frontend.
- Usar variáveis de ambiente para URLs e tokens em desenvolvimento.
- Sempre validar o status HTTP antes de atualizar a UI.