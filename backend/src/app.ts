import express from "express"
import { createRequire } from "module"
const require = createRequire(import.meta.url)
const cors = require("cors")
import { errorHandler } from "./middlewares/erros.js"
import dotenv from "dotenv"
import { validate } from "./middlewares/validate.js"
import { login } from "./controllers/auth.controller.js"
import { autenticar } from "./middlewares/auth.js"
import { DominiosRoutes } from "./routes/dominios/dominio-base.routes.js"
import dominiosRoutes from "./routes/dominios/dominios.routes.js"
import { PaisRoutes } from "./routes/pais.routes.js"
import { EstadoRouter } from "./routes/estado.routes.js"
import { UsuariosSchemas } from "./schemas/usuario.schema.js"
import { UsuariosRouter } from "./routes/usuarios.routes.js"
import { MunicipioRouter } from "./routes/municipio.routes.js"


dotenv.config()

const app = express()
const port = Number(process.env.PORT) || 3000

app.use(cors({
    origin: [
        "https://projeto-rh-sj48.onrender.com",
        "http://localhost:3000",
        "http://localhost:5173"
    ]
}))

app.use(express.json())

app.post("/api/login", validate(new UsuariosSchemas().loginSchema, "body"), login, errorHandler)

app.use(autenticar)

app.use("/api/usuarios", new UsuariosRouter().router)

app.use("/api/", dominiosRoutes)

app.use("/api/pais", new PaisRoutes().router)

app.use("/api/estados", new EstadoRouter().router)

app.use("/api/municipios", new MunicipioRouter().router)

app.use(errorHandler)

app.listen(port, ()=>{
    console.log("Servidor Rodando em: Servidor rodando em http://localhost:" + port)
})

export default app;