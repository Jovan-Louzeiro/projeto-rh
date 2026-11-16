import Docxtemplater from "docxtemplater";
import PizZip from "pizzip"
import fs from "fs"
import path from "path";
import { fileURLToPath } from "url";
import { ServidorService } from "@/services/servidor.service.js";
import { Prisma } from "#/generated/prisma/client.js";
import { MatriculaService } from "@/services/matricula.service.js";
import { ContatoService } from "@/services/contato.service.js";
import { MunicipioService } from "@/services/municipio.service.js";

import { HistoricoFuncionalSevice } from "@/services/historicoFuncional.service.js";

export async function gerarRequerimento({
    id_servidor,
    id_matricula,
    id_contato,

    data_entrada = new Intl.DateTimeFormat("pt-BR", {day: "2-digit", month: "2-digit", year: "numeric"}).format(new Date()),
    numero_protocolo,

    req_selecionado

}: {
    id_servidor: number,
    id_matricula: number,
    id_contato: number,

    data_entrada?: string,
    numero_protocolo: string,

    req_selecionado: number
}) {

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const content = fs.readFileSync(
        path.resolve(path.join(__dirname, ".."), "templates", "MODELO - REQUERIMENTO 2026 - ARIAL.docx"),
        "binary"
    )

    const zip = new PizZip(content)

    const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: false
    })

    const servidor: Prisma.ServidorGetPayload<{}> = await new ServidorService().procurar(id_servidor)

    const matricula: Prisma.MatriculaGetPayload<{}> = await new MatriculaService().procurar(id_matricula)

    const contato: Prisma.ContatoGetPayload<{}> = await new ContatoService().procurar(id_contato)

    const municipio_endereco = (await new MunicipioService().procurar(servidor.municipio_endereco_id)).nome

    const historico_funcional: Prisma.HistoricoFuncionalGetPayload<{ select: { cargo: true, funcao: true, departamento: true } }> = (await new HistoricoFuncionalSevice().listarHistoricoFuncionalPorMatricula(
        id_servidor,
        id_matricula,
        {
            data_fim: null
        },
        {
            cargo: true,
            funcao: true,
            departamento: true
        }
    ))[0]

    const cargo = historico_funcional.cargo.descricao
    const funcao = historico_funcional.departamento?.descricao ?? cargo
    const departamento = historico_funcional.departamento?.descricao ?? "Não Informado"

    console.log(municipio_endereco)

    const opcoes = [
        { numero: 1, selecionado: false, texto: "Licença para qualificação profissional" },
        { numero: 2, selecionado: false, texto: "Revisão de proventos" },
        { numero: 3, selecionado: false, texto: "Aposentadoria" },
        { numero: 4, selecionado: false, texto: "Afastamento para mandato eletivo" },
        { numero: 5, selecionado: false, texto: "Licença paternidade" },
        { numero: 6, selecionado: false, texto: "Promoção docente" },
        { numero: 7, selecionado: false, texto: "Licença para tratar de interesse particular" },
        { numero: 8, selecionado: false, texto: "Pagamento de atrasados" },
        { numero: 9, selecionado: false, texto: "Licença maternidade" },
        { numero: 10, selecionado: false, texto: "Licença motivo doença pessoa da família" },
        { numero: 11, selecionado: false, texto: "Mudança de dados pessoais" },
        { numero: 12, selecionado: false, texto: "Declaração" },
        { numero: 13, selecionado: false, texto: "Licença para tratamento de saúde" },
        { numero: 14, selecionado: false, texto: "Licença prêmio por assiduidade" },
        { numero: 15, selecionado: false, texto: "Férias" },
        { numero: 16, selecionado: false, texto: "Remoção para ___________________" },
        { numero: 17, selecionado: false, texto: "Certidão de tempo de serviço" },
        { numero: 18, selecionado: false, texto: "Outros" }
    ];

    opcoes.map(value => value.selecionado = value.numero === req_selecionado)

    const requerimentosFormatado: Record<number, string> = {};

    opcoes.forEach(opcao => {
        requerimentosFormatado[opcao.numero] = opcao.selecionado ? "X" : "□";
    });

    const n_item = opcoes.filter(valor => valor.selecionado).map(opcoes => `${opcoes.numero}`)

    const requerimento = opcoes.find(value => value.numero === req_selecionado)?.texto

    doc.render({
        numero_protocolo: numero_protocolo,
        data_entrada: data_entrada,

        nome_completo: servidor.nome_completo,
        matricula_numero: matricula.numero,
        admissao_matricula: new Intl.DateTimeFormat("pt-BR",{ day: "2-digit", month: "2-digit", year: "numeric"}).format(matricula.admissao),

        cargo_descricao: cargo,
        funcao_descricao: funcao,
        departamento_descricao: departamento,

        endereco_logradouro: servidor.logradouro,
        numero_endereco: servidor.numero,
        bairro_endereco: servidor.bairro,
        cidade_endereco: municipio_endereco,

        telefone: contato.contato,

        requerimento: requerimento,

        n_item: n_item
    })

    const buf = doc.toBuffer()

    fs.writeFileSync(path.resolve(__dirname, `${crypto.randomUUID()}.docx`), buf);

}

gerarRequerimento({
    id_servidor: 39,
    id_matricula: 23,
    id_contato: 48,

    numero_protocolo: "13/2026",

    req_selecionado: 5
    })