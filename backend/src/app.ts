import express from "express"
import router from "./routes/sexo.routes.js"
import cors from 'cors'
import { errorHandler } from "./middlewares/erros.js"

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

app.use("/api/sexos", router)

app.post("/api/servidor", (req, res) =>{
    
    console.log(req.body)

})

app.use(errorHandler)

app.listen(port, ()=>{
    console.log("Servidor Rodando em: Servidor rodando em http://localhost:" + port)
})