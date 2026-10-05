import z from "zod";
import { CrudSchemas } from "./crud.schemas.js";

export class ServidorSchemas extends CrudSchemas {

    public readonly adicionar
    public readonly atualizar

    constructor() {
        super()

        const baseSchema = z.strictObject({

            ativo: this.ativoSchema(),

            //Identificação
            nome_completo: this.stringSchema("Nome Completo", 1, 150),

            nome_social: this.stringSchema("Nome Social", 1, 150, true),

            cpf: this.cpfSchema("Cpf"),

            nis_pis: this.numeroSchema("Nis / Pis", 11).optional(),

            // Nascimento / Nacionalidade

            data_nascimento: this.dataSchema("Data de Nascimento"),

            nacionalidade_id: this.idExternoSchema("Id do Nacionalidade"),

            pais_origem_id: this.idExternoSchema("Id do Pais de Origem").optional(),

            ano_chegada_brasil: z
                .number()
                .int("O ano deve ser um número inteiro")
                .min(1500, "Ano de chegada inválido")
                .max(new Date().getFullYear(), "O ano não pode ser futuro")
                .optional(),

            municipio_nascimento_id: this.idExternoSchema("Id do Municipio de Nacimento").optional(),

            // Filiação

            cpf_mae: this.cpfSchema("Cpf da Mãe").optional(),

            nome_mae: this.stringSchema("Nome da Mãe", 1, 150),

            cpf_pai: this.cpfSchema("Cpf do Pai").optional(),

            nome_pai: this.stringSchema("Nome do Pai", 1, 150),

            // Estado Civil

            estado_civil_id: this.idExternoSchema("Id do Estado Civil").optional(),

            uniao_estavel: this.ativoSchema(),

            // Características

            sexo_id: this.idExternoSchema("Id do Sexo"),

            genero_id: this.idExternoSchema("Id do Gênero").optional(),

            racacor_id: this.idExternoSchema("Id da Raca / Cor"),

            comunidade_indigena_id: this.idExternoSchema("Id da Comunidade Indígena").optional(),

            // Endereço

            cep: this.numeroSchema("CEP", 8),

            logradouro: this.stringSchema("Logradouro", 1, 100),

            numero: this.stringSchema("Número", 0, 10, true),

            complemento: this.stringSchema("Complemento", undefined, 100, true),

            bairro: this.stringSchema("Bairro", 1, 50),

            municipio_endereco_id: this.idExternoSchema("Município de Endereço"),

            zona_endereco_id: this.idExternoSchema("Id daZona de Endereço"),

            localizacao_diferenciada_id: this.idExternoSchema("Id da Localização Diferenciada").optional(),


            // Saúde
            cartao_sus: this.numeroSchema("Cartão do Sus", 15).optional(),

            // Dados Funcionais

            situacao_id: this.idExternoSchema("Id da Situação"),

            escolaridade_id: this.idExternoSchema("Id da Escolaridade").optional(),

            tipo_ensino_medio_cursado_id: this.idExternoSchema("Id do Tipo de Ensino Médio Cursado").optional(),

            // Curso de formação continuada

            observacao: this.stringSchema("Observação", 0, 500, true)
        })

        this.adicionar = baseSchema

        this.atualizar = baseSchema
            .partial()
            .refine(
                data => Object.keys(data).length > 0,
                {
                    message: "É necessário informar pelo menos um campo para atualizar"
                }
            );

    }
}