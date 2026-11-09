import Docxtemplater from "docxtemplater";
import PizZip from "pizzip"
import fs from "fs"
import path from "path";
import { fileURLToPath } from "url";

export async function gerarRequerimento({
    data
}: {

    data: {
        numero_protocolo: string,
        data_entrada: string,

        nome_completo: string,
        matricula_numero: string,
        admissao_matricula: string,

        cargo_descricao: string,
        funcao_descricao: string,
        departamento_descricao: string,

        endereco_logradouro: string,
        numero_endereco: string,
        bairro_endereco: string,
        cidade_endereco: string,

        telefone: string,

        requerimento_nome: string,

    }
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

    doc.render(data)

    const buf = doc.toBuffer()

    fs.writeFileSync(path.resolve(__dirname, `${crypto.randomUUID()}.docx`), buf);

}