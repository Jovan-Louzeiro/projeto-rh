# Documentação da API

## URL base

http://localhost:3000

---
# Erros comuns

400 Bad Request
```json
    "erro": "DADOS_INVALIDOS"
```

409 Conflict
```json
    "erro": "REGISTRO_JA_EXISTE"
```
ou
```json
    "erro": "REGISTRO_NAO_EXISTE"
```

500 Internal Server Error
```json
    "erro": "ERRO_INTERNO"
```

# Sexos


## Adicionar sexos

POST /sexos/adicionar

### Body Request

Estrutura do envio

```json
{
    "descricao": "Intersexo"
}
```

### Respostas

201 Created
```json
    "mensagem": "Sexo cadastrado com sucesso"
```


## Listar sexos

GET /sexos

### Resposta

200 OK

```json
[
  {
    "id": 1,
    "nome": "Masculino"
  },
  {
    "id": 2,
    "nome": "Feminino"
  }
]
```
---
## Procurar sexo
GET /sexos/:id

### Resposta

200 OK
```json
  {
    "id_sexo": 1,
    "descricao": "M"
  }
```

## Atualizar Sexo
PUT /sexos/atualizar/:id

### Body Request

```json
  {
    "descricao": "Masculino"
  }
```

### Resposta
```json
{
	"mensagem": "Sexo atualizado com sucesso",
	"prisma": {
		"id_sexo": 1,
		"descricao": "Masculino"
	}
}
```

## Deletar Sexo

DEL /sexos/deletar/:id

## Resposta
```json
{
	"mensagem": "Sexo excluido com sucesso",
	"prisma": {
		"id_sexo": 1,
		"descricao": "Masculino"
	}
}
```