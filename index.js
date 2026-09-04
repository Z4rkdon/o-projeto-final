// npm init
// npm i express
// npm i mysql2
// npm i bcrypt
const express = require('express')
const app = express()
const port = 3000

app.use(express.json())

const db = require('./db')
const bcrypt = require('bcrypt')

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
             "SELECT email, senha FROM cliente WHERE email = ?", [user.email]
        )
        const dados_db = resultado[0][0]
        if (!dados_db){
            return res.status(500).json({msg: "EMAIL não cadastrado"})
        }

    } catch (error) {
        res .status(500).json({ erro: error.message })
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

app.get("/cliente/:id", async (req, res) => {
    try {
        const { id } = req.params
        const [clientes] = await $2b$10$CbZWty6udli18Sxu9MWNsOIrJ9FcE/JEtzaUTdJIb0JjiBhA2d2f6db.pool.query("SELECT id, nome, cpf, celular, email FROM cliente WHERE id = ?", [id])
        
        if (clientes.length === 0) {
            return res.status(404).json({ mensagem: "Cliente não encontrado." })
        }
        
        res.status(200).json(clientes[0])
    } catch (error) {
        res.status(500).json({ erro: error.message })
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
