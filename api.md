# API Projeto RH

API REST desenvolvida para gerenciamento de usuários, autenticação e cadastro de sexos.

## 🚀 Tecnologias

* API REST
* JSON
* Autenticação via Bearer Token
* Insomnia para testes das requisições

## 🌐 URL Base

```text
https://projeto-rh-sj48.onrender.com
```

A URL base está configurada como uma variável de ambiente no Insomnia.

---

# 🔐 Autenticação

As rotas protegidas utilizam autenticação através do cabeçalho:

```http
Authorization: Bearer <token>
```

O token deve ser obtido através da rota de login e enviado nas requisições que exigem autenticação.

> **Importante:** nunca publique tokens de acesso reais no GitHub ou em arquivos públicos. Utilize variáveis de ambiente.

---

# 🔑 Login

## POST `/api/login`

Realiza a autenticação de um usuário.

### Requisição

```http
POST /api/login
Content-Type: application/json
```

### Body

```json
{
  "email": "seu@email.com",
  "senha": "sua_senha"
}
```

A coleção do Insomnia utiliza `POST /api/login` e recebe `email` e `senha` no corpo JSON.

### Exemplo com cURL

```bash
curl -X POST "https://projeto-rh-sj48.onrender.com/api/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "seu@email.com",
    "senha": "sua_senha"
  }'
```

---

# 👤 Usuários

A API disponibiliza operações para consultar, cadastrar, atualizar e excluir usuários.

## GET `/api/usuarios`

Retorna a lista de usuários.

### Headers

```http
Authorization: Bearer <token>
```

---

## GET `/api/usuarios/:id`

Retorna um usuário específico através do seu ID.

### Exemplo

```http
GET /api/usuarios/5
Authorization: Bearer <token>
```

A requisição de exemplo utiliza o ID `5`.

---

## POST `/api/usuarios`

Cadastra um novo usuário.

### Headers

```http
Content-Type: application/json
Authorization: Bearer <token>
```

### Body

```json
{
  "nome": "teste",
  "email": "teste@email.com",
  "senha": "123",
  "permissao": "RH"
}
```

Os campos utilizados na requisição configurada são `nome`, `email`, `senha` e `permissao`.

---

## PATCH `/api/usuarios/:id`

Atualiza informações de um usuário.

### Exemplo

```http
PATCH /api/usuarios/4
Content-Type: application/json
Authorization: Bearer <token>
```

### Body

```json
{
  "nome": "Testudo",
  "permissao": "ADMIN"
}
```

A coleção demonstra a atualização do nome e da permissão do usuário.

---

## DELETE `/api/usuarios/:id`

Exclui um usuário através do ID.

### Exemplo

```http
DELETE /api/usuarios/5
Authorization: Bearer <token>
```

A requisição configurada utiliza o ID `5`.

---

# ⚧️ Sexos

A API possui operações para consultar, cadastrar, buscar, atualizar e excluir registros de sexo.

## GET `/api/sexos`

Retorna os registros cadastrados.

### Headers

```http
Content-Type: application/json
Authorization: Bearer <token>
```

A rota utiliza autenticação Bearer Token.

---

## POST `/api/sexos`

Cadastra um novo registro.

### Body

```json
{
  "descricao": "Digitar Genero"
}
```

### Headers

```http
Content-Type: application/json
Authorization: Bearer <token>
```

Esse formato corresponde à requisição configurada no Insomnia.

---

## GET `/api/sexos/:id`

Busca um registro específico pelo ID.

### Exemplo

```http
GET /api/sexos/3
Authorization: Bearer <token>
```

A coleção possui uma requisição de consulta por ID.

---

## PATCH `/api/sexos/:id`

Atualiza um registro existente.

### Exemplo

```http
PATCH /api/sexos/1
Content-Type: application/json
Authorization: Bearer <token>
```

### Body

```json
{
  "descricao": "M",
  "ativo": true
}
```

Os campos `descricao` e `ativo` aparecem na requisição de atualização configurada.

---

## DELETE `/api/sexos/:id`

Exclui um registro pelo ID.

### Exemplo

```http
DELETE /api/sexos/7
Authorization: Bearer <token>
```

A coleção utiliza uma requisição `DELETE` para `/api/sexos/:id`.

---

# 📋 Resumo das Rotas

| Método   | Endpoint            | Autenticação | Descrição         |
| -------- | ------------------- | ------------ | ----------------- |
| `POST`   | `/api/login`        | ❌            | Realizar login    |
| `GET`    | `/api/usuarios`     | ✅            | Listar usuários   |
| `GET`    | `/api/usuarios/:id` | ✅            | Buscar usuário    |
| `POST`   | `/api/usuarios`     | ✅            | Cadastrar usuário |
| `PATCH`  | `/api/usuarios/:id` | ✅            | Atualizar usuário |
| `DELETE` | `/api/usuarios/:id` | ✅            | Excluir usuário   |
| `GET`    | `/api/sexos`        | ✅            | Listar sexos      |
| `POST`   | `/api/sexos`        | ✅            | Cadastrar sexo    |
| `GET`    | `/api/sexos/:id`    | ✅            | Buscar sexo       |
| `PATCH`  | `/api/sexos/:id`    | ✅            | Atualizar sexo    |
| `DELETE` | `/api/sexos/:id`    | ✅            | Excluir sexo      |

---

# 🧪 Testando com Insomnia

As requisições podem ser importadas/configuradas no **Insomnia**, utilizando:

```text
base_url = https://projeto-rh-sj48.onrender.com
```

Para as rotas protegidas, configure o token na variável:

```text
token_access
```

e utilize:

```http
Authorization: {{ _.token_access }}
```

As coleções enviadas já possuem essa estrutura de variáveis para as requisições autenticadas.

---

# 📁 Organização da API

Atualmente, as funcionalidades documentadas estão divididas em:

```text
API
├── 🔐 Login
│   └── POST /api/login
│
├── 👤 Usuários
│   ├── GET    /api/usuarios
│   ├── GET    /api/usuarios/:id
│   ├── POST   /api/usuarios
│   ├── PATCH  /api/usuarios/:id
│   └── DELETE /api/usuarios/:id
│
└── ⚧️ Sexos
    ├── GET    /api/sexos
    ├── POST   /api/sexos
    ├── GET    /api/sexos/:id
    ├── PATCH  /api/sexos/:id
    └── DELETE /api/sexos/:id
```

# ⚠️ Segurança

* Não compartilhe tokens de autenticação.
* Não coloque tokens reais no `README.md`.
* Não envie senhas reais para repositórios públicos.
* Utilize variáveis de ambiente para informações sensíveis.
