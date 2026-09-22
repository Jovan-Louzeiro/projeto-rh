import express from "express"
import router from "./routes/usuarios.routes.js"
import { createRequire } from "module"
const require = createRequire(import.meta.url)
const cors = require("cors")
import { errorHandler } from "./middlewares/erros.js"
import dotenv from "dotenv"
import { validate } from "./middlewares/validate.js"
import { loginSchema } from "./schemas/usuario.schema.js"
import { login } from "./controllers/auth.controller.js"
import { autenticar } from "./middlewares/auth.js"
import { dominiosConfig } from "./config/dominios.config.js"
import { dominios } from "./factories/dominios.factory.js"


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

app.post("/api/login", validate(loginSchema), login, errorHandler)

app.use(autenticar)

// Rotas de Dominios
for (const [chave, config] of Object.entries(dominiosConfig)) {
    app.use(
        `/api/${config.rota}`,
        dominios[chave].router
    );
}

export default router;



app.use("/api/usuarios", router)


app.use(errorHandler)

app.listen(port, ()=>{
    console.log("Servidor Rodando em: Servidor rodando em http://localhost:" + port)
})