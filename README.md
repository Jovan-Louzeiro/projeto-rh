# 🏢 Projeto RH — Backend

API REST para gerenciamento de servidores, documentos funcionais, dados cadastrais e domínios utilizados pelo sistema de Recursos Humanos.

O backend foi desenvolvido com **Node.js + Express + TypeScript**, utilizando **Prisma + PostgreSQL** para persistência, **Zod** para validação dos dados e **JWT** para autenticação.

---

## 🚀 Tecnologias

* Node.js
* TypeScript
* Express
* Prisma ORM
* PostgreSQL
* Zod
* JWT
* bcrypt
* CORS
* date-fns

---

# 🌐 URL da API

### Desenvolvimento

```text
http://localhost:3000
```

### Produção

```text
https://projeto-rh-sj48.onrender.com
```

Todos os endpoints da aplicação utilizam o prefixo:

```text
/api
```

Exemplo:

```text
GET https://projeto-rh-sj48.onrender.com/api/servidores
```

---

# 🔐 Autenticação

Com exceção do login, **todas as rotas exigem autenticação JWT**.

## Login

```http
POST /api/login
```

### Body

```json
{
  "email": "usuario@email.com",
  "senha": "123456"
}
```

### Resposta — `200`

```json
{
  "mensagem": "Login Realizado com Sucesso",
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

O frontend deve armazenar o token e enviá-lo nas próximas requisições.

### Header

```http
Authorization: Bearer SEU_TOKEN
```

Exemplo:

```javascript
fetch(`${API_URL}/api/servidores`, {
  headers: {
    Authorization: `Bearer ${token}`,
    Accept: "application/json"
  }
});
```

### Validade

O token possui validade de **8 horas**.

---

# 👥 Permissões

Existem dois níveis de usuário:

```text
ADMIN
RH
```

Por padrão:

| Operação        |  RH | ADMIN |
| --------------- | :-: | :---: |
| Listar          |  ✅  |   ✅   |
| Procurar por ID |  ✅  |   ✅   |
| Adicionar       |  ❌  |   ✅   |
| Atualizar       |  ❌  |   ✅   |
| Excluir         |  ❌  |   ✅   |

> Em ambiente de desenvolvimento (`NODE_ENV=development`), a autorização por permissão é ignorada.

---

# 📦 Padrão das rotas CRUD

A maior parte da API utiliza o seguinte padrão:

```http
GET    /api/recurso
GET    /api/recurso/:id
POST   /api/recurso
PATCH  /api/recurso/:id
DELETE /api/recurso/:id
```

### Listar

```http
GET /api/recurso
```

Por padrão, são retornados somente registros com:

```json
{
  "ativo": true
}
```

Para retornar também registros inativos:

```http
GET /api/recurso?mostrarTudo=true
```

### Procurar

```http
GET /api/recurso/:id
```

### Adicionar

```http
POST /api/recurso
Content-Type: application/json
```

### Atualizar

```http
PATCH /api/recurso/:id
Content-Type: application/json
```

O `PATCH` permite enviar somente os campos que precisam ser alterados.

### Excluir

```http
DELETE /api/recurso/:id
```

> ⚠️ A exclusão é física. O campo `ativo` é utilizado para filtragem/listagem, mas o `DELETE` remove o registro do banco.

---

# 👤 Servidores

Endpoint principal:

```text
/api/servidores
```

## Listar servidores

```http
GET /api/servidores
```

Somente servidores ativos são retornados por padrão.

Para todos:

```http
GET /api/servidores?mostrarTudo=true
```

---

## Buscar servidor

```http
GET /api/servidores/:idServidor
```

Exemplo:

```http
GET /api/servidores/1
```

---

## Cadastrar servidor

```http
POST /api/servidores
```

### Body

```json
{
  "nome_completo": "João da Silva",
  "nome_social": "João",
  "cpf": "12345678909",
  "nis_pis": "12345678901",

  "data_nascimento": "10/05/1990",

  "nacionalidade_id": 1,
  "pais_origem_id": 1,
  "ano_chegada_brasil": 2000,
  "municipio_nascimento_id": 1,

  "cpf_mae": "98765432100",
  "nome_mae": "Maria da Silva",

  "cpf_pai": "11122233344",
  "nome_pai": "José da Silva",

  "estado_civil_id": 1,
  "uniao_estavel": false,

  "sexo_id": 1,
  "genero_id": 1,
  "racacor_id": 1,
  "comunidade_indigena_id": 1,

  "cep": "65210000",
  "logradouro": "Rua Principal",
  "numero": "100",
  "complemento": "Casa",
  "bairro": "Centro",

  "municipio_endereco_id": 1,
  "zona_endereco_id": 1,
  "localizacao_diferenciada_id": 1,

  "cartao_sus": "123456789012345",

  "situacao_id": 1,
  "escolaridade_id": 1,
  "tipo_ensino_medio_cursado_id": 1,

  "observacao": "Observação do servidor"
}
```

### Campos obrigatórios

```text
nome_completo
cpf
data_nascimento
nacionalidade_id
nome_mae
nome_pai
sexo_id
racacor_id
cep
logradouro
bairro
municipio_endereco_id
zona_endereco_id
situacao_id
```

Os demais campos podem ser opcionais conforme o schema.

### Formato das datas

O frontend deve enviar datas como:

```text
DD/MM/AAAA
```

Exemplo:

```text
25/12/2000
```

A API converte internamente para `Date`.

---

## Atualizar servidor

```http
PATCH /api/servidores/:idServidor
```

Exemplo:

```json
{
  "nome_social": "João Silva",
  "observacao": "Servidor atualizado"
}
```

É necessário enviar pelo menos um campo.

---

## Excluir servidor

```http
DELETE /api/servidores/:idServidor
```

---

# 📄 Documentos do servidor

Os documentos pertencem diretamente a um servidor.

A estrutura das URLs é:

```text
/api/servidores/:idServidor/{documento}
```

Documentos disponíveis:

```text
certidao
cnh
ctps
identidade
tituloEleitor
```

Exemplo:

```text
/api/servidores/15/identidade
```

Cada servidor possui no máximo um registro de cada tipo de documento.

---

# 🪪 Identidade

Endpoint:

```text
/api/servidores/:idServidor/identidade
```

## Buscar

```http
GET /api/servidores/15/identidade
```

## Cadastrar

```http
POST /api/servidores/15/identidade
```

### RG

```json
{
  "tipo_identidade": "RG",
  "numero": "123456789",
  "orgao_emissor": "SSP",
  "rg_uf_id": 10,
  "rg_data_emissao": "10/05/2018"
}
```

### CIN

Na CIN, o CPF é o identificador e **não deve ser enviado como `numero`**.

```json
{
  "tipo_identidade": "CIN",
  "orgao_emissor": "SSP",
  "rg_uf_id": 10,
  "rg_data_emissao": "10/05/2025"
}
```

Valores permitidos:

```text
tipo_identidade:
- RG
- CIN
```

> Para RG, `numero` é obrigatório. Para CIN, `numero` não deve ser informado.

---

## Atualizar identidade

```http
PUT /api/servidores/:idServidor/identidade
```

Exemplo:

```json
{
  "tipo_identidade": "RG",
  "numero": "123456789",
  "orgao_emissor": "SSP",
  "rg_uf_id": 10,
  "rg_data_emissao": "10/05/2018"
}
```

## Excluir identidade

```http
DELETE /api/servidores/:idServidor/identidade
```

---

# 🚘 CNH

Endpoint:

```text
/api/servidores/:idServidor/cnh
```

### POST

```http
POST /api/servidores/15/cnh
```

```json
{
  "numero": "12345678901",
  "categoria": "AB",
  "data_emissao": "10/05/2020",
  "data_validade": "10/05/2030"
}
```

### PUT

```http
PUT /api/servidores/15/cnh
```

Utiliza o mesmo formato.

### GET

```http
GET /api/servidores/15/cnh
```

### DELETE

```http
DELETE /api/servidores/15/cnh
```

O número da CNH deve possuir exatamente **11 dígitos**.

---

# 💼 CTPS

Endpoint:

```text
/api/servidores/:idServidor/ctps
```

Existem dois tipos:

```text
ANTIGO
NOVO
```

## CTPS antiga

```json
{
  "tipo_ctps": "ANTIGO",
  "numero": "12345678",
  "serie": "12345",
  "uf_ctps_id": 10,
  "data_emissao": "10/05/2018"
}
```

Para CTPS antiga, os seguintes campos são obrigatórios:

```text
numero
serie
uf_ctps_id
```

## CTPS nova

```json
{
  "tipo_ctps": "NOVO",
  "data_emissao": "10/05/2025"
}
```

Na CTPS nova:

```text
numero → não enviar
serie → não enviar
uf_ctps_id → não enviar
```

---

# 📜 Certidão

Endpoint:

```text
/api/servidores/:idServidor/certidao
```

Tipos:

```text
NASCIMENTO
CASAMENTO
```

## Certidão nova

```json
{
  "nova_certidao": true,
  "matricula": "12345678901234567890123456789012",
  "tipo_certidao": "NASCIMENTO",
  "data_emissao": "10/05/2020"
}
```

Para certidão nova:

```text
termo → não enviar
folha → não enviar
livro → não enviar
```

## Certidão antiga

```json
{
  "nova_certidao": false,
  "matricula": "12345678901234567890123456789012",
  "tipo_certidao": "NASCIMENTO",
  "termo": "12345",
  "folha": "12345",
  "livro": "12345",
  "data_emissao": "10/05/2000"
}
```

Para certidão antiga, `termo`, `folha` e `livro` são obrigatórios.

---

# 🗳️ Título de Eleitor

Endpoint:

```text
/api/servidores/:idServidor/tituloEleitor
```

### Body

```json
{
  "numero": "123456789012",
  "zona": "1234",
  "secao": "1234"
}
```

Todos os campos são obrigatórios.

---

# 📚 Detalhar servidor + documentos

Para obter um servidor juntamente com todos os seus documentos:

```http
GET /api/servidores/:idServidor/detalharDocumentos
```

Exemplo:

```http
GET /api/servidores/15/detalharDocumentos
```

A resposta contém o servidor e os relacionamentos:

```text
certidao
cnh
ctps
identidade
titulo_eleitor
```

Essa é a rota recomendada para a tela de **Perfil/Detalhes do Servidor**.

---

# 🌎 Países

Endpoint:

```text
/api/pais
```

### POST

```json
{
  "nome": "Brasil",
  "gentilico": "Brasileiro",
  "codigo_iso": "BR"
}
```

### Campos

| Campo      | Tipo             |
| ---------- | ---------------- |
| nome       | string           |
| gentilico  | string           |
| codigo_iso | string           |
| ativo      | boolean opcional |

---

# 🗺️ Estados

Endpoint:

```text
/api/estados
```

### POST

```json
{
  "nome": "Maranhão",
  "uf": "MA",
  "pais_id": 1
}
```

---

# 🏙️ Municípios

Endpoint:

```text
/api/municipios
```

### POST

```json
{
  "nome": "Carutapera",
  "estado_id": 10
}
```

---

# 📚 Domínios

Os domínios são utilizados pelo frontend para preencher `selects`, filtros e formulários.

Todos seguem o padrão CRUD:

```http
GET    /api/{dominio}
GET    /api/{dominio}/:id
POST   /api/{dominio}
PATCH  /api/{dominio}/:id
DELETE /api/{dominio}/:id
```

## Endpoints disponíveis

| Domínio                      | Endpoint                       |
| ---------------------------- | ------------------------------ |
| Comunidades Indígenas        | `/api/comunidadesIndigenas`    |
| Escolaridade                 | `/api/escolaridade`            |
| Gênero                       | `/api/generos`                 |
| Raça/Cor                     | `/api/racacor`                 |
| Sexo                         | `/api/sexos`                   |
| Nível                        | `/api/nivel`                   |
| Estado Civil                 | `/api/estadoCivil`             |
| Zona de Endereço             | `/api/zonaEndereco`            |
| Localização Diferenciada     | `/api/localizacaoDiferenciada` |
| Cargo                        | `/api/cargo`                   |
| Função                       | `/api/funcao`                  |
| Departamento                 | `/api/departamento`            |
| Tipo de Vínculo              | `/api/tipoVinculo`             |
| Tipo de Ensino Médio Cursado | `/api/tipoEnsinoMedioCursado`  |
| Situação                     | `/api/situacao`                |

---

# 🏷️ Estrutura dos domínios

A maioria dos domínios utiliza:

```json
{
  "descricao": "Descrição do registro"
}
```

O campo `ativo` é opcional:

```json
{
  "descricao": "Masculino",
  "ativo": true
}
```

### Exemplo

```http
GET /api/sexos
```

Resposta:

```json
[
  {
    "id_sexo": 1,
    "descricao": "Masculino",
    "ativo": true
  },
  {
    "id_sexo": 2,
    "descricao": "Feminino",
    "ativo": true
  }
]
```

---

# 🏫 Departamento

O departamento possui um campo adicional:

```json
{
  "descricao": "Secretaria Municipal de Educação",
  "inep": "12345678"
}
```

Endpoint:

```text
/api/departamento
```

---

# 👤 Usuários

Endpoint:

```text
/api/usuarios
```

O endpoint utiliza o mesmo padrão CRUD.

## Criar usuário

Somente `ADMIN`.

```http
POST /api/usuarios
```

```json
{
  "nome": "Administrador",
  "email": "admin@email.com",
  "senha": "123456",
  "permissao": "ADMIN",
  "ativo": true
}
```

Permissões:

```text
ADMIN
RH
```

A senha é armazenada utilizando hash.

---

# 📋 Respostas da API

## POST

Ao cadastrar um registro:

```http
201 Created
```

Formato:

```json
{
  "mensagem": "Servidor cadastrado com sucesso",
  "dados": {
    "...": "..."
  }
}
```

---

## PATCH

```http
200 OK
```

Formato:

```json
{
  "mensagem": "Servidor atualizado com sucesso",
  "dados": {
    "...": "..."
  }
}
```

---

## DELETE

```http
200 OK
```

Formato:

```json
{
  "mensagem": "Servidor Excluído com sucesso",
  "dados": {
    "...": "..."
  }
}
```

---

## GET

As rotas de listagem retornam diretamente um array:

```json
[
  {
    "id": 1
  },
  {
    "id": 2
  }
]
```

As rotas de busca retornam diretamente o objeto:

```json
{
  "id": 1
}
```

---

# ❌ Tratamento de erros

A API utiliza respostas JSON padronizadas.

## Dados inválidos — `422`

Quando o frontend envia dados que não atendem ao schema:

```json
{
  "erro": "DADOS_INVALIDOS",
  "detalhes": [
    {
      "code": "invalid_type",
      "path": ["cpf"],
      "message": "..."
    }
  ]
}
```

O campo `detalhes` deve ser utilizado pelo frontend para apresentar mensagens de validação.

---

## Não autenticado — `401`

### Token ausente

```json
{
  "erro": "TokenNaoFornecido",
  "mensagem": "Token não fornecido"
}
```

### Token inválido/expirado

```json
{
  "erro": "TokenInvalidoOuExpirado",
  "mensagem": "Token invalido ou expirado"
}
```

Nesse caso, o frontend deve normalmente:

1. remover o token armazenado;
2. redirecionar o usuário para o login.

---

## Sem permissão — `403`

```json
{
  "erro": "NaoAutorizado",
  "mensagem": "Você não tem permissão para esta ação"
}
```

---

## Usuário inativo — `403`

```json
{
  "erro": "UsuarioInativo",
  "mensagem": "O usuário não está ativo"
}
```

---

## Registro não encontrado — `404`

```json
{
  "erro": "RegistroNaoEncontradoError",
  "mensagem": "Servidor não encontrado."
}
```

---

## Registro duplicado — `409`

```json
{
  "erro": "RegistroJaExistenteError",
  "mensagem": "cpf informado já está em uso."
}
```

Isso pode acontecer, por exemplo, ao tentar cadastrar um CPF já existente.

---

## Registro em uso — `409`

```json
{
  "erro": "RegistroEmUso",
  "mensagem": "Registro não pode ser deletado, pois está sendo utilizado."
}
```

---

## Erro interno — `500`

```json
{
  "erro": "ERRO_INTERNO",
  "mensagem": "Erro interno do servidor."
}
```

---

# 🔢 Formatação dos números

A API recebe documentos como **strings**, mesmo quando são exclusivamente numéricos.

Exemplo correto:

```json
{
  "cpf": "12345678909"
}
```

A API remove automaticamente caracteres de formatação.

Assim, também é possível enviar:

```text
123.456.789-09
```

e o backend armazenará:

```text
12345678909
```

O mesmo comportamento é utilizado para diversos campos numéricos, como:

```text
CPF
NIS/PIS
CEP
Cartão SUS
RG
CNH
CTPS
Título de Eleitor
Zona
Seção
```

Por isso, o frontend **não deve converter esses campos para `number`**.

Use:

```typescript
cpf: string
```

e não:

```typescript
cpf: number
```

Isso também evita a perda de zeros à esquerda.

---

# 📅 Datas

As datas enviadas para a API devem utilizar:

```text
DD/MM/AAAA
```

Exemplo:

```text
07/10/2026
```

A API transforma essas strings em `Date` antes de persistir no PostgreSQL.

No retorno JSON, datas podem aparecer no formato ISO:

```text
2026-10-07T00:00:00.000Z
```

O frontend deve formatá-las para apresentação ao usuário.

---

# 🧩 Exemplo de cliente HTTP

Uma implementação simples para o frontend:

```typescript
const API_URL = import.meta.env.VITE_API_URL ?? "";

async function apiFetch(
  endpoint: string,
  options: RequestInit = {}
) {
  const token = localStorage.getItem("rh_access_token");

  const response = await fetch(
    `${API_URL}/api${endpoint}`,
    {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",

        ...(token
          ? {
              Authorization: `Bearer ${token}`
            }
          : {}),

        ...options.headers
      }
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return data;
}
```

Exemplo:

```typescript
const servidores = await apiFetch("/servidores");
```

Cadastrar:

```typescript
await apiFetch("/servidores", {
  method: "POST",
  body: JSON.stringify({
    nome_completo: "João da Silva",
    cpf: "12345678909",
    // ...
  })
});
```

---

# ⚠️ Pontos importantes para o frontend

## 1. Não utilizar `/adicionar`, `/atualizar` ou `/deletar`

As rotas atuais são RESTful.

❌ Incorreto:

```text
POST /api/sexos/adicionar
PUT /api/sexos/atualizar/1
DELETE /api/sexos/deletar/1
```

✅ Correto:

```text
POST /api/sexos
PATCH /api/sexos/1
DELETE /api/sexos/1
```

---

## 2. Servidores utilizam `idServidor`

Para servidores:

```text
/api/servidores/:idServidor
```

Exemplo:

```text
/api/servidores/10
```

---

## 3. Documentos utilizam o ID do servidor

Não existe uma rota global como:

```text
/api/documentos
```

O documento sempre pertence a um servidor:

```text
/api/servidores/10/identidade
/api/servidores/10/cnh
/api/servidores/10/ctps
/api/servidores/10/certidao
/api/servidores/10/tituloEleitor
```

---

## 4. Documentos usam JSON

Os endpoints de documentos atualmente recebem:

```http
Content-Type: application/json
```

e **não utilizam `multipart/form-data` nem upload de arquivos**.

---

## 5. Não enviar `servidor_id` ao cadastrar documentos

O servidor é identificado pela URL.

Exemplo:

```http
POST /api/servidores/10/identidade
```

Body:

```json
{
  "tipo_identidade": "RG",
  "numero": "123456789",
  "orgao_emissor": "SSP",
  "rg_uf_id": 10,
  "rg_data_emissao": "10/05/2018"
}
```

O backend associa automaticamente:

```text
servidor_id = 10
```

---

# 🗂️ Estrutura resumida da API

```text
/api
│
├── /login
│
├── /usuarios
│
├── /servidores
│   ├── /:idServidor
│   ├── /:idServidor/detalharDocumentos
│   ├── /:idServidor/certidao
│   ├── /:idServidor/cnh
│   ├── /:idServidor/ctps
│   ├── /:idServidor/identidade
│   └── /:idServidor/tituloEleitor
│
├── /pais
├── /estados
├── /municipios
│
├── /comunidadesIndigenas
├── /escolaridade
├── /generos
├── /racacor
├── /sexos
├── /nivel
├── /estadoCivil
├── /zonaEndereco
├── /localizacaoDiferenciada
├── /cargo
├── /funcao
├── /departamento
├── /tipoVinculo
├── /tipoEnsinoMedioCursado
└── /situacao
```

---

# 🛠️ Executando o backend

## Instalação

Dentro da pasta `backend`:

```bash
npm install
```

## Variáveis de ambiente

Crie um arquivo:

```text
.env
```

com as configurações necessárias:

```env
DATABASE_URL="postgresql://usuario:senha@host:5432/banco"
JWT_SECRET="sua-chave-secreta"
NODE_ENV="development"
PORT=3000
```

---

## Prisma

Para gerar o Prisma Client:

```bash
npx prisma generate
```

Para aplicar as migrations:

```bash
npx prisma migrate deploy
```

Durante desenvolvimento:

```bash
npx prisma migrate dev
```

---

## Rodar em desenvolvimento

```bash
npm run dev
```

A API ficará disponível em:

```text
http://localhost:3000
```

---

## Build

```bash
npm run build
```

## Produção

```bash
npm start
```

---

# 🏗️ Arquitetura

O backend utiliza uma arquitetura baseada em:

```text
Routes
   ↓
Controllers
   ↓
Services
   ↓
Prisma
   ↓
PostgreSQL
```

### Routes

Responsáveis por definir:

* métodos HTTP;
* endpoints;
* autenticação;
* autorização;
* validação.

### Controllers

Responsáveis por:

* receber requisições;
* chamar os services;
* definir status HTTP;
* devolver respostas JSON.

### Services

Contêm as regras de negócio e acesso aos dados através do Prisma.

### Schemas

Utilizam Zod para validar:

* `body`;
* `params`;
* `query`.

### Middleware de autenticação

Responsável por validar o JWT e controlar as permissões dos usuários.

---

# 🗄️ Banco de dados

O projeto utiliza:

```text
PostgreSQL
```

através do Prisma ORM.

As principais entidades atualmente implementadas incluem:

```text
Servidor
Usuario

Pais
Estado
Municipio

Sexo
Genero
RacaCor
ComunidadeIndigena
Escolaridade
Nivel
EstadoCivil
ZonaEndereco
LocalizacaoDiferenciada

Cargo
Funcao
Departamento
TipoVinculo
TipoEnsinoMedioCursado
Situacao

Certidao
CNH
CTPS
Identidade
TituloEleitor
```

---

# 📌 Status do backend

O backend possui atualmente:

* ✅ Autenticação JWT
* ✅ Controle de permissões
* ✅ CRUD de servidores
* ✅ CRUD de usuários
* ✅ CRUD de países
* ✅ CRUD de estados
* ✅ CRUD de municípios
* ✅ CRUD de domínios
* ✅ Identidade/RG/CIN
* ✅ CNH
* ✅ CTPS
* ✅ Certidão
* ✅ Título de Eleitor
* ✅ Validação com Zod
* ✅ Tratamento padronizado de erros
* ✅ Prisma + PostgreSQL
* ✅ Migrations

---

# 👨‍💻 Integração com o frontend

O frontend deve tratar o backend como uma **API REST autenticada**.

Fluxo recomendado:

```text
1. Usuário abre o sistema
        ↓
2. Frontend apresenta login
        ↓
3. POST /api/login
        ↓
4. Backend retorna JWT
        ↓
5. Frontend armazena token
        ↓
6. Frontend envia Authorization: Bearer TOKEN
        ↓
7. Frontend consome os endpoints
        ↓
8. Se receber 401 → renovar/login novamente
        ↓
9. Se receber 403 → informar falta de permissão
```

Para formulários:

```text
Frontend
   ↓
validação/formatação visual
   ↓
JSON
   ↓
API
   ↓
Zod
   ↓
Service
   ↓
Prisma
   ↓
PostgreSQL
```

---

# ⚠️ Observação sobre o frontend atual

O frontend presente neste repositório ainda possui alguns serviços que seguem um contrato anterior da API.

Por exemplo, o serviço atual de documentos utiliza:

```text
/api/documentos
```

e `FormData`, enquanto o backend atual utiliza:

```text
/api/servidores/:idServidor/documento
```

com `application/json`.

Da mesma forma, o cadastro atual de servidor no frontend utiliza nomes simplificados como:

```text
nome
dataNascimento
sexoId
```

enquanto o backend espera:

```text
nome_completo
data_nascimento
sexo_id
```

Portanto, **os serviços do frontend devem ser adaptados ao contrato documentado neste README**, e não o contrário.

---

# 📄 Licença

Projeto desenvolvido para fins de desenvolvimento do sistema de Recursos Humanos.
