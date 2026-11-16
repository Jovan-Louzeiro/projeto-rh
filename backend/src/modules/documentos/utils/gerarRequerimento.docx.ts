import Docxtemplater from "docxtemplater";
import fs from "node:fs";
import path from "node:path";
import PizZip from "pizzip";
import { fileURLToPath } from "node:url";
import type { RequerimentoDadosHistoricos } from "@/modules/documentos/schemas/requerimento.schema.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function gerarRequerimento({
    data,
}: {
    data: RequerimentoDadosHistoricos;
}): Promise<Buffer> {
    const nomeTemplate = "MODELO - REQUERIMENTO 2026 - ARIAL.docx";
    const caminhosTemplate = [
        path.resolve(
            __dirname,
            "..",
            "templates",
            nomeTemplate,
        ),
        path.resolve(
            __dirname,
            "..",
            "..",
            "..",
            "..",
            "..",
            "src",
            "modules",
            "documentos",
            "templates",
            nomeTemplate,
        ),
    ];
    const template = caminhosTemplate.find(caminho => fs.existsSync(caminho));
    if (!template) {
        throw new Error("O modelo DOCX do requerimento não foi encontrado.");
    }
    const content = fs.readFileSync(template, "binary");
    const zip = new PizZip(content);
    const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
    });
    const dataBr = (valor: string) => /^\d{4}-\d{2}-\d{2}$/.test(valor)
        ? valor.split("-").reverse().join("/")
        : valor;
    const requerimentos = data.tipos.map(tipo =>
        tipo === "Outros" && data.outro_especificacao
            ? `Outros: ${data.outro_especificacao}`
            : tipo,
    ).join(", ");

    doc.render({
        ...data,
        data_entrada: dataBr(data.data_entrada),
        admissao_matricula: dataBr(data.admissao_matricula),
        requerimento: requerimentos,
        requerimento_nome: requerimentos,
    });

    return doc.toBuffer();
}
