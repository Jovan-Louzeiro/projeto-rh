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

## Backend: configuração e execução local

O backend fica na pasta `backend/` e usa Node.js, TypeScript, Express, Prisma e PostgreSQL. Instale as dependências a partir da raiz do repositório, onde está o `package.json` principal:

```bash
npm install
cd backend
```

Crie `backend/.env` com as variáveis abaixo. Configure as URLs para o seu banco PostgreSQL e não compartilhe nem versione esse arquivo:

```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/projeto_rh"
DIRECT_URL="postgresql://usuario:senha@localhost:5432/projeto_rh"
JWT_SECRET="defina-um-segredo-forte"
PORT=3000
```

- `DATABASE_URL`: conexão utilizada pela API.
- `DIRECT_URL`: conexão direta utilizada pelo Prisma nas migrações.
- `JWT_SECRET`: segredo usado para assinar e validar os tokens JWT.
- `PORT`: porta HTTP; se omitida, o backend usa `3000`.

Gere o cliente Prisma, aplique as migrações pendentes e inicie o servidor em modo de desenvolvimento:

```bash
npx prisma generate --config prisma.config.ts
npx prisma migrate dev --config prisma.config.ts
npx tsx watch src/app.ts
```

Para compilar e iniciar a versão compilada, a partir de `backend/`:

```bash
npx tsc -p tsconfig.json
node dist/src/app.js
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

Resposta de sucesso (`200`):

```json
{
  "mensagem": "Login Realizado com Sucesso",
  "token": "eyJ..."
}
```

O token expira em 8 horas. Envie-o nas rotas protegidas no header HTTP de autorização usando o esquema Bearer.

---

## ✅ Permissões

As permissões da aplicação são:

- `ADMIN`
- `RH`

Regras atuais da API:

- `GET /api/usuarios` e `GET /api/usuarios/:id` → `RH`, `ADMIN`
- `POST /api/usuarios` → `ADMIN`
- `PATCH /api/usuarios/:id` e `DELETE /api/usuarios/:id` → `ADMIN`
- Rotas de domínio, países, estados, municípios e servidores:
  - `GET` e `GET /:id` → `RH`, `ADMIN`
  - `POST` → `ADMIN`
  - `PATCH` e `DELETE` → `ADMIN`

---

# 👤 Usuários

## GET `/api/usuarios`

Lista os usuários ativos. Essa rota não oferece um parâmetro para incluir usuários inativos.

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
| Raça/Cor | `/api/racacor` | `GET`, `GET /:id`, `POST`, `PATCH /:id`, `DELETE /:id` |
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

### Outras rotas de cadastro

Além dos domínios auxiliares, há rotas CRUD para países, estados, municípios e servidores:

| Recurso | Rota base | Operações |
| --- | --- | --- |
| Países | `/api/pais` | `GET`, `GET /:id`, `POST`, `PATCH /:id`, `DELETE /:id` |
| Estados | `/api/estados` | `GET`, `GET /:id`, `POST`, `PATCH /:id`, `DELETE /:id` |
| Municípios | `/api/municipios` | `GET`, `GET /:id`, `POST`, `PATCH /:id`, `DELETE /:id` |
| Servidores | `/api/servidores` | `GET`, `GET /:id`, `POST`, `PATCH /:id`, `DELETE /:id` |

## 📥 Inputs detalhados das rotas

Todas as rotas abaixo, exceto `POST /api/login`, exigem um token JWT válido no header HTTP de autorização (esquema Bearer). Nas operações com JSON, envie também `Content-Type: application/json`. As rotas de leitura não recebem body.

### Parâmetros comuns de rota

Todas as rotas no formato `/:id` recebem o identificador na URL, por exemplo `/api/usuarios/12`. O `id` deve ser um inteiro positivo. Se for inválido, a API responde com erro de validação (`422`).

### Login — `POST /api/login`

Body obrigatório:

| Campo | Tipo | Regra |
| --- | --- | --- |
| `email` | string | De 1 a 50 caracteres |
| `senha` | string | Pelo menos 3 caracteres |

O body não aceita propriedades adicionais. Exemplo:

```json
{
  "email": "rh@exemplo.com",
  "senha": "senha123"
}
```

### Usuários — `/api/usuarios`

| Método e rota | Inputs |
| --- | --- |
| `GET /api/usuarios` | Sem body nem parâmetros. Retorna usuários ativos; `mostrarTudo` não altera esse comportamento. |
| `GET /api/usuarios/:id` | Path param `id`: inteiro positivo. |
| `POST /api/usuarios` | Body com todos os campos obrigatórios indicados abaixo; `ativo` é opcional. |
| `PATCH /api/usuarios/:id` | Path param `id` e body com pelo menos um campo da criação; todos os campos do body são opcionais nesta operação. |
| `DELETE /api/usuarios/:id` | Path param `id`: inteiro positivo; sem body. |

Body de criação (`POST`) e campos permitidos em atualização (`PATCH`):

| Campo | Tipo | Regra |
| --- | --- | --- |
| `nome` | string | Obrigatório; de 1 a 50 caracteres |
| `email` | string | Obrigatório; de 1 a 50 caracteres |
| `senha` | string | Obrigatório na criação; pelo menos 3 caracteres |
| `permissao` | string | Obrigatório na criação; `ADMIN` ou `RH` |
| `ativo` | boolean | Opcional |

No `PATCH`, envie apenas os campos que deseja alterar; `{}` é inválido. Campos extras são rejeitados.

### Rotas de domínio — tabelas auxiliares

Esta seção vale para cada rota base listada na tabela de domínios auxiliares (por exemplo, `/api/sexos`, `/api/cargo` e `/api/situacao`):

| Método | Inputs |
| --- | --- |
| `GET /api/<rota>` | Sem body. Opcionalmente, `?mostrarTudo=true` inclui registros inativos; sem isso, lista somente ativos. |
| `GET /api/<rota>/:id` | Path param `id`: inteiro positivo; sem body. |
| `POST /api/<rota>` | Body JSON: `descricao` obrigatório e `ativo` opcional. |
| `PATCH /api/<rota>/:id` | Path param `id` e body com `descricao`, `ativo` ou ambos; envie ao menos um campo. |
| `DELETE /api/<rota>/:id` | Path param `id`: inteiro positivo; sem body. |

`descricao` deve ser uma string não vazia e respeitar o limite por rota:

| Rota | Máximo de caracteres em `descricao` |
| --- | ---: |
| `/api/comunidadesIndigenas` | 50 |
| `/api/escolaridade` | 50 |
| `/api/generos` | 20 |
| `/api/racacor` | 10 |
| `/api/sexos` | 10 |
| `/api/nivel` | 10 |
| `/api/estadoCivil` | 15 |
| `/api/zonaEndereco` | 10 |
| `/api/localizacaoDiferenciada` | 50 |
| `/api/cargo` | 50 |
| `/api/funcao` | 50 |
| `/api/departamento` | 150 |
| `/api/tipoVinculo` | 50 |
| `/api/tipoEnsinoMedioCursado` | 50 |
| `/api/situacao` | 30 |

Para `/api/departamento`, além de `descricao` e `ativo`, o campo `inep` é obrigatório no `POST` e aceita string de 1 a 50 caracteres. No `PATCH`, `inep` também pode ser enviado isoladamente.

Exemplo de body para criar ou atualizar um domínio simples:

```json
{
  "descricao": "Exemplo",
  "ativo": true
}
```

### Países — `/api/pais`

| Método e rota | Inputs |
| --- | --- |
| `GET /api/pais` | Sem body; `mostrarTudo=true` opcional para incluir inativos. |
| `GET /api/pais/:id` | Path param `id`: inteiro positivo. |
| `POST /api/pais` | Body com `nome`, `gentilico` e `codigo_iso` obrigatórios; `ativo` opcional. |
| `PATCH /api/pais/:id` | Path param `id` e pelo menos um dos campos permitidos no body de criação. |
| `DELETE /api/pais/:id` | Path param `id`: inteiro positivo; sem body. |

| Campo | Tipo | Regra |
| --- | --- | --- |
| `nome` | string | De 1 a 100 caracteres |
| `gentilico` | string | De 1 a 100 caracteres |
| `codigo_iso` | string | De 1 a 2 caracteres |
| `ativo` | boolean | Opcional |

### Estados — `/api/estados`

| Método e rota | Inputs |
| --- | --- |
| `GET /api/estados` | Sem body; `mostrarTudo=true` opcional para incluir inativos. |
| `GET /api/estados/:id` | Path param `id`: inteiro positivo. |
| `POST /api/estados` | Body com `nome`, `uf` e `pais_id` obrigatórios; `ativo` opcional. |
| `PATCH /api/estados/:id` | Path param `id` e pelo menos um dos campos permitidos no body de criação. |
| `DELETE /api/estados/:id` | Path param `id`: inteiro positivo; sem body. |

| Campo | Tipo | Regra |
| --- | --- | --- |
| `nome` | string | De 1 a 100 caracteres |
| `uf` | string | De 1 a 2 caracteres |
| `pais_id` | inteiro positivo | ID de país |
| `ativo` | boolean | Opcional |

### Municípios — `/api/municipios`

| Método e rota | Inputs |
| --- | --- |
| `GET /api/municipios` | Sem body; `mostrarTudo=true` opcional para incluir inativos. |
| `GET /api/municipios/:id` | Path param `id`: inteiro positivo. |
| `POST /api/municipios` | Body com `nome` e `estado_id` obrigatórios; `ativo` opcional. |
| `PATCH /api/municipios/:id` | Path param `id` e pelo menos um dos campos permitidos no body de criação. |
| `DELETE /api/municipios/:id` | Path param `id`: inteiro positivo; sem body. |

| Campo | Tipo | Regra |
| --- | --- | --- |
| `nome` | string | De 1 a 100 caracteres |
| `estado_id` | inteiro positivo | ID de estado |
| `ativo` | boolean | Opcional |

### Servidores — `/api/servidores`

| Método e rota | Inputs |
| --- | --- |
| `GET /api/servidores` | Sem body; `mostrarTudo=true` opcional para incluir inativos. |
| `GET /api/servidores/:id` | Path param `id`: inteiro positivo. |
| `POST /api/servidores` | Body JSON com todos os campos obrigatórios da tabela a seguir; os demais são opcionais. |
| `PATCH /api/servidores/:id` | Path param `id` e pelo menos um campo definido abaixo; todos são opcionais nesta operação. |
| `DELETE /api/servidores/:id` | Path param `id`: inteiro positivo; sem body. |

Campos obrigatórios no `POST`:

| Campo | Tipo | Regra |
| --- | --- | --- |
| `nome_completo` | string | De 1 a 150 caracteres |
| `cpf` | string | CPF válido com 11 dígitos; pontuação é removida antes da validação |
| `data_nascimento` | string | Data válida no formato `DD/MM/AAAA` |
| `nacionalidade_id` | inteiro positivo | ID de nacionalidade |
| `nome_mae` | string | De 1 a 150 caracteres |
| `nome_pai` | string | De 1 a 150 caracteres |
| `sexo_id` | inteiro positivo | ID de sexo |
| `racacor_id` | inteiro positivo | ID de raça/cor |
| `cep` | string numérica | Exatamente 8 dígitos |
| `logradouro` | string | De 1 a 100 caracteres |
| `bairro` | string | De 1 a 50 caracteres |
| `municipio_endereco_id` | inteiro positivo | ID de município |
| `zona_endereco_id` | inteiro positivo | ID de zona de endereço |
| `situacao_id` | inteiro positivo | ID de situação |

Campos opcionais em `POST` e `PATCH`:

| Campo | Tipo | Regra |
| --- | --- | --- |
| `ativo` | boolean | Opcional |
| `nome_social` | string | Até 150 caracteres |
| `nis_pis` | string numérica | Exatamente 11 dígitos |
| `pais_origem_id` | inteiro positivo | ID de país |
| `ano_chegada_brasil` | inteiro | Entre 1500 e o ano atual |
| `municipio_nascimento_id` | inteiro positivo | ID de município |
| `cpf_mae` | string | CPF válido com 11 dígitos |
| `cpf_pai` | string | CPF válido com 11 dígitos |
| `estado_civil_id` | inteiro positivo | ID de estado civil |
| `uniao_estavel` | boolean | Opcional |
| `genero_id` | inteiro positivo | ID de gênero |
| `comunidade_indigena_id` | inteiro positivo | ID de comunidade indígena |
| `numero` | string | Até 10 caracteres; pode ser vazio |
| `complemento` | string | Até 100 caracteres |
| `localizacao_diferenciada_id` | inteiro positivo | ID de localização diferenciada |
| `cartao_sus` | string numérica | Exatamente 15 dígitos |
| `escolaridade_id` | inteiro positivo | ID de escolaridade |
| `tipo_ensino_medio_cursado_id` | inteiro positivo | ID do tipo de ensino médio |
| `observacao` | string | Até 500 caracteres; pode ser vazia |

Campos numéricos de documentos devem ser enviados como strings. A validação remove caracteres não numéricos antes de conferir a quantidade de dígitos. Os campos `id` aceitam valores que possam ser convertidos em inteiro positivo. Corpos de criação e atualização rejeitam campos não listados; no `PATCH`, o body não pode estar vazio.

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
| `GET`, `POST`, `PATCH`, `DELETE` | `/api/pais`, `/api/estados`, `/api/municipios`, `/api/servidores` | ✅ | Consulta e mantém cadastros geográficos e de servidores |

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