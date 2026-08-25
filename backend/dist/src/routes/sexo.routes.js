import { Router } from "express";
import { listar } from "../controllers/sexo.controller.js";
const router = Router();
router.get("/", listar);
export default router;
//# sourceMappingURL=sexo.routes.js.map