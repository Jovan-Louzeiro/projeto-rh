import multer from "multer";
import { AppError } from "@/errors/app.errors.js";

const tiposPermitidos = ["application/pdf", "image/jpeg", "image/png"];

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024,
        files: 5,
        fields: 1,
        fieldSize: 2 * 1024 * 1024,
    },
    fileFilter: (_req, arquivo, callback) => {
        if (!tiposPermitidos.includes(arquivo.mimetype)) {
            return callback(new AppError(422, "Envie arquivos PDF, JPG, JPEG ou PNG."));
        }
        return callback(null, true);
    },
});

export const uploadDocumentoDigitalizado = upload.single("arquivo");

export const uploadDocumentosDigitalizadosServidor = upload.fields([
    { name: "arquivo_certidao", maxCount: 1 },
    { name: "arquivo_cnh", maxCount: 1 },
    { name: "arquivo_ctps", maxCount: 1 },
    { name: "arquivo_identidade", maxCount: 1 },
    { name: "arquivo_tituloEleitor", maxCount: 1 },
]);
