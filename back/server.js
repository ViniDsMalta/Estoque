require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg"); 

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
});

async function initDB() {
    try {
        
        await pool.query(`
            CREATE TABLE IF NOT EXISTS produtos (
                id SERIAL PRIMARY KEY,
                nome VARCHAR(25) NOT NULL,
                quantidade INTEGER NOT NULL,
                preco NUMERIC(10,2) NOT NULL
            )
        `);
        console.log("Tabela verificada/criada com sucesso");
    } catch (err) {
        console.error("Erro ao criar tabela:", err); 
    }
}
initDB();

app.get("/", (req, res) => {
    res.send(`
        <h2> API de controle de estoque </h2>
        <p> API funcionando corretamente </p>
        <a href="/api/produtos">Ver Produtos</a> 
    `); 
});

const BASE_URL = "/api/produtos";

// GET - Listar
app.get(BASE_URL, async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM produtos ORDER BY id DESC");
        res.json(result.rows); // Correção: .json() em vez de .join()
    } catch (err) {
        res.status(500).json({ error: "Erro ao buscar produtos" });
    }
});

// POST - Criar
app.post(BASE_URL, async (req, res) => {
    try {
        const { nome, quantidade, preco } = req.body;
        const result = await pool.query(
            "INSERT INTO produtos (nome, quantidade, preco) VALUES($1, $2, $3) RETURNING *",
            [nome, quantidade, preco]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: "Erro ao inserir produto" });
    }
});

// PUT - Atualizar
app.put(`${BASE_URL}/:id`, async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, quantidade, preco } = req.body;

        
        const result = await pool.query(
            "UPDATE produtos SET nome=$1, quantidade=$2, preco=$3 WHERE id=$4 RETURNING *", 
            [nome, quantidade, preco, id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Produto não encontrado" });
        }

        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: "Erro ao atualizar o produto" });
    }
});


app.delete(`${BASE_URL}/:id`, async (req, res) => {
    try {
        const { id } = req.params;

        
        const result = await pool.query("DELETE FROM produtos WHERE id=$1", [id]);
        
        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Produto não encontrado" });
        }

        res.json({ message: "Produto removido com sucesso" });
    } catch (err) {
        res.status(500).json({ error: "Erro ao remover produto" });
    }
});

app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));