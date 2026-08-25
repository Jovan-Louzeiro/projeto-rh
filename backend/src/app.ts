import express from "express"
import router from "./routes/sexo.routes.js"

const app = express()
const port = 3000

app.use(express.json())

app.get("/api/", (req, res) =>{

    res.json({
        mensagem: "testando"
    })

})

app.use("/api/sexos", router)

app.post("/api/servidor", (req, res) =>{
    
    console.log(req.body)

})

app.listen(port, ()=>{
    console.log("Servidor Rodando em: Servidor rodando em http://localhost:" + port)
})