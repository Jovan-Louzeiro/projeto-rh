import PDFDocument from "pdfkit";
import type { RequerimentoDadosHistoricos } from "@/modules/documentos/schemas/requerimento.schema.js";

function dataBrasileira(valor: string) {
    return /^\d{4}-\d{2}-\d{2}$/.test(valor)
        ? valor.split("-").reverse().join("/")
        : valor;
}

export async function gerarRequerimentoPdf({
    data,
}: {
    data: RequerimentoDadosHistoricos;
}): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        const documento = new PDFDocument({ size: "A4", margin: 48 });
        const partes: Buffer[] = [];

        documento.on("data", parte => partes.push(Buffer.from(parte)));
        documento.once("error", reject);
        documento.once("end", () => resolve(Buffer.concat(partes)));

        const secao = (titulo: string) => {
            documento.moveDown(0.7);
            documento.font("Helvetica-Bold").fontSize(11).text(titulo.toLocaleUpperCase("pt-BR"));
            documento.moveDown(0.25);
        };
        const campo = (titulo: string, valor: string) => {
            documento.font("Helvetica-Bold").fontSize(9).text(`${titulo}: `, { continued: true });
            documento.font("Helvetica").text(valor || "—");
        };

        documento.font("Helvetica-Bold").fontSize(16).text("REQUERIMENTO", { align: "center" });
        documento.moveDown(0.25);
        documento.font("Helvetica").fontSize(10).text(
            "Prefeitura de Carutapera — Departamento de Recursos Humanos",
            { align: "center" },
        );

        secao("Protocolo");
        campo("Número", data.numero_protocolo);
        campo("Data de entrada", dataBrasileira(data.data_entrada));

        secao("Dados do servidor");
        campo("Nome completo", data.nome_completo);
        campo("Matrícula", data.matricula_numero);
        campo("CPF", data.cpf ?? "");
        campo("Admissão", dataBrasileira(data.admissao_matricula));
        campo("Cargo", data.cargo_descricao);
        campo("Função", data.funcao_descricao);
        campo("Lotação", data.departamento_descricao);
        campo("Endereço", `${data.endereco_logradouro}, ${data.numero_endereco} — ${data.bairro_endereco}`);
        campo("Cidade", data.cidade_endereco);
        campo("Telefone", data.telefone);

        secao("Solicitação");
        documento.font("Helvetica").fontSize(10).text(
            "Vem requerer ao(à) Diretor(a) do Departamento de Recursos Humanos:",
        );
        documento.moveDown(0.3);
        for (const tipo of data.tipos) {
            const descricao = tipo === "Outros" && data.outro_especificacao
                ? `Outros: ${data.outro_especificacao}`
                : tipo;
            documento.text(`• ${descricao}`, { indent: 12 });
        }

        secao("Justificativa");
        documento.font("Helvetica").fontSize(10).text(data.justificativa, {
            align: "justify",
        });

        documento.moveDown(1.2);
        const aceite = data.assinatura.aceite
            ? `Declaração eletrônica aceita por ${data.assinatura.usuario}${data.assinatura.dataHora
                ? ` em ${new Date(data.assinatura.dataHora).toLocaleString("pt-BR")}`
                : ""}.`
            : "Declaração eletrônica não aceita.";
        documento.font("Helvetica").fontSize(9).text(
            aceite,
        );

        documento.end();
    });
}
