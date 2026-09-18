// npm init
// npm i express
// npm i mysql2

const express = require('express')
const app = express()
const port = 3000

app.use(express.json())

const db = require('./db')

// npm i bcrypt
const bcrypt = require('bcrypt')

// npm i jsonwebtoken
const jwt = require("jsonwebtoken")

// npm i dotenv
const dotenv = require("dotenv")
dotenv.config()

// npm i cors
const cors = require("cors")
app.use(cors())

app.post("/cliente", async (req, res) => {
    try {
        const cliente = req.body
        const senhaCript = bcrypt.hashSync(cliente.senha, 10)
        cliente.senha = senhaCript

        const [resultado] = await db.pool.query(
            `INSERT INTO cliente(nome, cpf, celular, email, senha) VALUES (?, ?, ?, ?, ?)`,
            [cliente.nome, cliente.cpf, cliente.celular, cliente.email, cliente.senha]
        )
        
        res.status(201).json({
            mensagem: "Cliente cadastrado com sucesso!",
            id: resultado.insertId
        })
    } catch (error) {
        res.status(500).json({ erro: error.message })
    }
})

app.post("/login", async (req,res) => {
    try{
        const user = req.body
        const resultado = await db.pool.query(
             "SELECT id, nome, email, senha FROM cliente WHERE email = ?", [user.email]
        )
        const dados_db = resultado[0][0]
        if (!dados_db){
            return res.status(401).json({msg: "EMAIL não cadastrado"})
        }
        
        const senha_valida = await bcrypt.compare(user.senha, dados_db.senha)

        if(!senha_valida){
            return res.status(401).json({msg: "Credenciais inválidas"})
        }
         
        const payload = {
            id: dados_db.id,
            email: dados_db.email
        }
        const token = jwt.sign(payload, process.env.JWT_SECRET,{expiresIn: "3m" })
        return res.status(200).json({nome: dados_db.nome, token: token})

    } catch (error) {
        res.status(500).json({ erro: error.message })
    }
})

app.get("/cliente", async (req, res) => {
    try {
        const [clientes] = await db.pool.query("SELECT id, nome, cpf, celular, email FROM cliente")
        res.status(200).json(clientes)
    } catch (error) {
        res.status(500).json({ erro: error.message })
    }
})

app.get("/cliente/perfil",autenticar , async (req, res) => {
    try {
        const id = req.usuario.id
        const clientes = await db.pool.query("SELECT id, nome, cpf, celular, email FROM cliente WHERE id = ?", [id]);
        const perfil = clientes[0][0]
        res.status(200).json(perfil)
    } catch (err) {
        res.status(500).json({ erro: "ERRO INTERNO" });
        throw err;
    }
})

app.put("/cliente/:id", async (req, res) => {
    try {
        const { id } = req.params
        const cliente = req.body

        if (cliente.senha) {
            cliente.senha = bcrypt.hashSync(cliente.senha, 10)
        }

        const [linhas] = await db.pool.query("SELECT * FROM cliente WHERE id = ?", [id])
        if (linhas.length === 0) {
            return res.status(404).json({ mensagem: "Cliente não encontrado." })
        }

        const clienteAtual = linhas[0]

        const nome = cliente.nome || clienteAtual.nome
        const cpf = cliente.cpf || clienteAtual.cpf
        const celular = cliente.celular || clienteAtual.celular
        const email = cliente.email || clienteAtual.email
        const senha = cliente.senha || clienteAtual.senha

        await db.pool.query(
            `UPDATE cliente SET nome = ?, cpf = ?, celular = ?, email = ?, senha = ? WHERE id = ?`,
            [nome, cpf, celular, email, senha, id]
        )

        res.status(200).json({ mensagem: "Cliente atualizado com sucesso!" })
    } catch (error) {
        res.status(500).json({ erro: error.message })
    }
})

app.delete("/cliente/:id", async (req, res) => {
    try {
        const { id } = req.params
        const [resultado] = await db.pool.query("DELETE FROM cliente WHERE id = ?", [id])
        
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ mensagem: "Cliente não encontrado." })
        }

        res.status(200).json({ mensagem: "Cliente excluído com sucesso!" })
    } catch (error) {
        res.status(500).json({ erro: error.message })
    }
})

app.listen(port, () => {
    console.log('API rodando na porta ' + port)
})

function autenticar(req, res, next){
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null){
        return res.status(401).json({erro: "Token não enviado, usar Authorization Bearer <token>"})
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, usuario) => {
        if (err) return res.status(403).json({erro: "Token inválido"})
        req.usuario = usuario
        next()
    })   
}