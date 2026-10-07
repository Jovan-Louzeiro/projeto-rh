import { CertidaoService } from "./certidao.service.js";
import { CnhService } from "./cnh.service.js";

const doc = new CnhService()

const resultado = await doc.listar(true)

console.log(resultado)