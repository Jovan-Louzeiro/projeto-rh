import z, { union } from "zod";
import { CrudSchemas } from "@/schemas/crud.schemas.js";
import { IdentidadeSchemas } from "@/schemas/documentos/identidade.schemas.js";
import { CertidaoSchemas } from "@/schemas/documentos/certidao.schemas.js";
import { CnhSchemas } from "@/schemas/documentos/cnh.schemas.js";
import { CtpsSchemas } from "@/schemas/documentos/ctps.schemas.js";
import { TituloEleitorSchemas } from "@/schemas/documentos/tituloEleitor.schema.js";
import { ContatoSchema } from "@/schemas/contato.schemas.js";
import { MatriculaSchemas } from "@/schemas/matricula.schemas.js";
import { Prisma } from "#/generated/prisma/client.js";


export class ServidorSchemas extends CrudSchemas {

    public readonly adicionar
    public readonly atualizar
    public readonly queryParams
    public readonly select

    constructor() {

        super()
        
        const documentos = {
            certidao: new CertidaoSchemas(),
            cnh: new CnhSchemas(),
            ctps: new CtpsSchemas(),
            identidade: new IdentidadeSchemas(),
            titulo_eleitor: new TituloEleitorSchemas()
        }

        const contatos = new ContatoSchema()

        const matriculas = new MatriculaSchemas()


        const baseSchema = z.strictObject({

            ativo: this.ativoSchema(),

            //Identificação
            nome_completo: this.stringSchema("Nome Completo", 1, 150),

            nome_social: this.stringSchema("Nome Social", 1, 150, true).nullable(),

            cpf: this.cpfSchema("Cpf"),

            nis_pis: this.numeroSchema("Nis / Pis", 11).optional().nullable(),

            // Nascimento / Nacionalidade

            data_nascimento: this.dataSchema("Data de Nascimento"),

            nacionalidade_id: this.idExternoSchema("Id do Nacionalidade"),

            pais_origem_id: this.idExternoSchema("Id do Pais de Origem").optional().nullable(),

            ano_chegada_brasil: z
                .number()
                .int("O ano deve ser um número inteiro")
                .min(1500, "Ano de chegada inválido")
                .max(new Date().getFullYear(), "O ano não pode ser futuro")
                .optional()
                .nullable(),

            municipio_nascimento_id: this.idExternoSchema("Id do Municipio de Nacimento").optional().nullable(),

            // Filiação

            cpf_mae: this.cpfSchema("Cpf da Mãe").optional().nullable(),

            nome_mae: this.stringSchema("Nome da Mãe", 1, 150),

            cpf_pai: this.cpfSchema("Cpf do Pai").optional().nullable(),

            nome_pai: this.stringSchema("Nome do Pai", 1, 150),

            // Estado Civil

            estado_civil_id: this.idExternoSchema("Id do Estado Civil").optional().nullable(),

            uniao_estavel: this.ativoSchema().optional().nullable(),

            // Características

            sexo_id: this.idExternoSchema("Id do Sexo"),

            genero_id: this.idExternoSchema("Id do Gênero").optional().nullable(),

            racacor_id: this.idExternoSchema("Id da Raca / Cor"),

            comunidade_indigena_id: this.idExternoSchema("Id da Comunidade Indígena").optional().nullable(),

            // Endereço

            cep: this.numeroSchema("CEP", 8),

            logradouro: this.stringSchema("Logradouro", 1, 100),

            numero: this.stringSchema("Número", 0, 10, true).nullable(),

            complemento: this.stringSchema("Complemento", undefined, 100, true).nullable(),

            bairro: this.stringSchema("Bairro", 1, 50),

            municipio_endereco_id: this.idExternoSchema("Município de Endereço"),

            zona_endereco_id: this.idExternoSchema("Id daZona de Endereço"),

            localizacao_diferenciada_id: this.idExternoSchema("Id da Localização Diferenciada").optional().nullable(),


            // Saúde
            cartao_sus: this.numeroSchema("Cartão do Sus", 15).optional().nullable(),

            // Dados Funcionais

            situacao_id: this.idExternoSchema("Id da Situação"),

            escolaridade_id: this.idExternoSchema("Id da Escolaridade").optional().nullable(),

            tipo_ensino_medio_cursado_id: this.idExternoSchema("Id do Tipo de Ensino Médio Cursado").optional(),

            // Curso de formação continuada

            observacao: this.stringSchema("Observação", 0, 500, true).nullable()
        })

        this.adicionar = baseSchema.extend({

            certidao: documentos.certidao.schemaServidor.optional(),
            cnh: documentos.cnh.schemaServidor.optional(),
            ctps: documentos.ctps.schemaServidor.optional(),
            identidade: documentos.identidade.schemaServidor.optional(),
            titulo_eleitor: documentos.titulo_eleitor.schemaServidor.optional(),

            contatos: z.array(contatos.adicionar).optional(),

            matriculas: z.array(matriculas.servidorSchema)

        })

        this.atualizar = baseSchema
            .partial()
            .refine(
                data => Object.keys(data).length > 0,
                {
                    message: "É necessário informar pelo menos um campo para atualizar"
                }
            );

        this.select = z.
                    array(
                        z.union(
                            [
                                baseSchema.keyof(),
                                z.literal("id_servidor"),

                                z.literal("sexo"),
                                z.literal("nacionalidade"),
                                z.literal("pais_origem"),
                                z.literal("municipio_nascimento"),
                                z.literal("estado_civil"),
                                z.literal("genero"),
                                z.literal("racacor"),
                                z.literal("comunidade_indigena"),
                                z.literal("contatos"),
                                z.literal("municipio_endereco"),
                                z.literal("zona_endereco"),
                                z.literal("localizacao_diferenciada"),

                                z.literal("certidao"),
                                z.literal("cnh"),
                                z.literal("identidade"),
                                z.literal("titulo_eleitor"),

                                z.literal("servidor_cid"),
                                z.literal("escolaridade"),
                                z.literal("tipo_ensino_medio_cursado"),
                                z.literal("cursos_formacao_continuada"),
                                z.literal("usuario"),


                                
                                

                                z.literal("matriculas")
                            ]
                        )
                    )

        this.queryParams = baseSchema
            .strip()
            .extend({
                id_servidor: this.idExternoSchema("id_servidor"),
                select: this.select
            })
            .partial()

    }
}

export type ServidorCreate = z.infer<
    ServidorSchemas["adicionar"]
>

export type ServidorUpdate = z.infer<
    ServidorSchemas["atualizar"]
>

export type ServidorQuery = z.infer<
    ServidorSchemas["queryParams"]
>

export type ServidorSelect = z.infer<
    ServidorSchemas["select"]
>