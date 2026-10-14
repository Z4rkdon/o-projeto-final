// npm init
// npm i mysql2

// npm i dotenv
const dotenv = require("dotenv")
dotenv.config()

// npm i express
const express = require('express')
const app = express()
const port = process.env.API_PORT

app.use(express.json())

const db = require('./db')

// npm i bcrypt
const bcrypt = require('bcrypt')

// npm i jsonwebtoken
const jwt = require("jsonwebtoken")

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


app.get("/produto", async (req, res) => {
    try {
        const [produtos] = await db.pool.query("SELECT id, nome, descricao, preco, estoque FROM produto")
        res.status(200).json(produtos)
    } catch (error) {
        res.status(500).json({ erro: error.message })
    }
})

app.get("/produto/:id", async (req, res) => {
    try {
        const { id } = req.params
        const [resultado] = await db.pool.query("SELECT id, nome, descricao, preco, estoque FROM produto WHERE id = ?", [id])
        
        if (resultado.length === 0) {
            return res.status(404).json({ mensagem: "Produto não encontrado." })
        }
        
        res.status(200).json(resultado[0])
    } catch (error) {
        res.status(500).json({ erro: error.message })
    }
})

app.post("/compra", autenticar, async (req, res) => {
    try {
        const { produto_id, quantidade, valor_total } = req.body
        const cliente_id = req.usuario.id 

        if (!produto_id || !quantidade || !valor_total) {
            return res.status(400).json({ mensagem: "Os campos produto_id, quantidade e valor_total são obrigatórios." })
        }

        const [resultado] = await db.pool.query(
            `INSERT INTO compra(cliente_id, produto_id, quantidade, valor_total, data_compra) VALUES (?, ?, ?, ?, NOW())`,
            [cliente_id, produto_id, quantidade, valor_total]
        )

        res.status(201).json({
            mensagem: "Compra realizada com sucesso!",
            id: resultado.insertId
        })
    } catch (error) {
        res.status(500).json({ erro: error.message })
    }
})

app.get("/compra", autenticar, async (req, res) => {
    try {
        const cliente_id = req.usuario.id 

        const [compras] = await db.pool.query(
            `SELECT c.id, c.quantidade, c.valor_total, c.data_compra, p.nome AS produto_nome 
             FROM compra c 
             INNER JOIN produto p ON c.produto_id = p.id 
             WHERE c.cliente_id = ?`, 
            [cliente_id]
        )
        
        res.status(200).json(compras)
    } catch (error) {
        res.status(500).json({ erro: error.message })
    }
})

app.get("/compra/:id", autenticar, async (req, res) => {
    try {
        const { id } = req.params
        const cliente_id = req.usuario.id

        const [resultado] = await db.pool.query(
            `SELECT c.id, c.quantidade, c.valor_total, c.data_compra, p.nome AS produto_nome, p.preco AS preco_unitario
             FROM compra c 
             INNER JOIN produto p ON c.produto_id = p.id 
             WHERE c.id = ? AND c.cliente_id = ?`, 
            [id, cliente_id]
        )

        if (resultado.length === 0) {
            return res.status(404).json({ mensagem: "Compra não encontrada ou acesso não autorizado." })
        }

        res.status(200).json(resultado[0])
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
