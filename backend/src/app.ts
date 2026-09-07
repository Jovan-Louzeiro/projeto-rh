import express from "express"
import routerSexo from "./routes/sexo.routes.js"
import routerCorRaca from "./routes/corRaca.routes.js"
import cors from 'cors'
import { errorHandler } from "./middlewares/erros.js"
import dotenv from "dotenv"
import { validate } from "./middlewares/validate.js"
import { loginSchema } from "./schemas/usuario.schema.js"
import { login } from "./controllers/auth.controller.js"
import { autenticar } from "./middlewares/auth.js"

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

app.use("/api/sexos", routerSexo)

//app.use("/api/corRaca", routerCorRaca)

app.use(errorHandler)

app.listen(port, ()=>{
    console.log("Servidor Rodando em: Servidor rodando em http://localhost:" + port)
})