import { PermissaoUsuario } from "#/generated/prisma/enums.js";
import { autorizar } from "@/middlewares/auth.js";
import { requerimentoController } from "@/modules/documentos/controllers/requerimento.controller.js";
import { AppError } from "@/errors/app.errors.js";
import { Router } from "express";
import multer from "multer";

const TIPOS_ARQUIVO = ["application/pdf", "image/jpeg", "image/png"];
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024,
        files: 10,
        fields: 1,
        fieldSize: 16 * 1024,
    },
    fileFilter: (_req, arquivo, callback) => {
        if (!TIPOS_ARQUIVO.includes(arquivo.mimetype)) {
            return callback(new AppError(422, "Envie arquivos PDF, JPG, JPEG ou PNG."));
        }
        return callback(null, true);
    },
});

export class RequerimentoRouter {
    public readonly router = Router();
    private readonly controller = new requerimentoController();

    constructor() {
        const rhOuAdmin = autorizar(PermissaoUsuario.RH, PermissaoUsuario.ADMIN);

        this.router.get("/", rhOuAdmin, this.controller.listarRequerimentos);
        this.router.post("/", rhOuAdmin, upload.array("anexos", 10), this.controller.cadastrarRequerimento);
        this.router.get("/:id", rhOuAdmin, this.controller.procurarRequerimento);
        this.router.put("/:id", rhOuAdmin, upload.array("anexos", 10), this.controller.atualizarRequerimento);
        this.router.post("/:id/assinado", rhOuAdmin, upload.single("arquivo"), this.controller.adicionarPdfAssinado);
        this.router.patch("/:id/status", rhOuAdmin, this.controller.alterarSituacao);
        this.router.get("/:id/historico", rhOuAdmin, this.controller.obterHistorico);
        this.router.get("/:id/anexos/:anexoId", rhOuAdmin, this.controller.obterAnexo);
        this.router.delete("/:id/anexos/:anexoId", rhOuAdmin, this.controller.deletarAnexo);
        this.router.get("/:id/documento", rhOuAdmin, this.controller.gerarDocumento);
        this.router.post("/:id/pdf", rhOuAdmin, this.controller.gerarPdf);
        this.router.delete(
            "/:id",
            autorizar(PermissaoUsuario.RH, PermissaoUsuario.ADMIN),
            this.controller.deletarRequerimento,
        );
    }
}
