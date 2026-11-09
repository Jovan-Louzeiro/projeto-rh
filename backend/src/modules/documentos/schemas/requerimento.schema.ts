import { CrudSchemas } from "@/schemas/crud.schemas.js";
import z from "zod";

export class RequerimentoSchemas extends CrudSchemas {

    public dados_historicos = z.strictObject({

            numero_protocolo: this.stringSchema("Numero Protocolo"),
            data_entrada: this.dataSchema("Data de Entrada").transform(date => date.toLocaleDateString("pt-br", {timeZone: "UTC"})),

            nome_completo: this.stringSchema("Nome Completo"),
            matricula_numero: this.stringSchema("Numero da Matrícula"),
            admissao_matricula: this.stringSchema("Admissao da Matrícula"),

            cargo_descricao: this.stringSchema("Descrição do Cargo"),
            funcao_descricao: this.stringSchema("Descrição da Função"),
            departamento_descricao: this.stringSchema("Descrição do Departamento"),

            endereco_logradouro: this.stringSchema("Logradouro de Endereço"),
            numero_endereco: this.stringSchema("Número de Endereço"),
            bairro_endereco: this.stringSchema("Bairro"),
            cidade_endereco: this.stringSchema("Cidade"),

            telefone: this.stringSchema("Número de Telefone"),

            requerimento_nome: this.stringSchema("Nome do Requerimento"),

        })


    private baseSchema = z.strictObject({

        numero_protocolo: this.stringSchema("Numero do Protocolo", 1),

        tipo_requerimento_id: this.idExternoSchema("Tipo Requerimento"),

        servidor_id: this.idExternoSchema("Servidor"),

        matricula_id: this.idExternoSchema("Matricula"),

        dados_historicos: this.dados_historicos
        
    })

    public adicionar = this.baseSchema

    public atualizar = this.baseSchema

    public where = this.baseSchema.omit({
        dados_historicos: true
    }).partial()

}

export type RequerimentoCreate = z.infer<
    RequerimentoSchemas["adicionar"]
>


export type RequerimentoUpdate = z.infer<
    RequerimentoSchemas["atualizar"]
>

export type RequerimentoDadosHistoricos = z.infer<
    RequerimentoSchemas["dados_historicos"]
>