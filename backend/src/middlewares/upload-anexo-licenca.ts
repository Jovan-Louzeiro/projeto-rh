import multer from "multer";
import { AppError } from "@/errors/app.errors.js";

const tiposPermitidos = ["application/pdf", "image/jpeg", "image/png"];

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024,
    files: 1,
  },
  fileFilter: (_req, arquivo, callback) => {
    if (!tiposPermitidos.includes(arquivo.mimetype)) {
      return callback(new AppError(422, "O anexo deve ser PDF, JPG ou PNG."));
    }
    return callback(null, true);
  },
});

export const uploadAnexoLicenca = upload.single("arquivo");
