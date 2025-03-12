const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 8080;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', 
    password: '120504', 
    database: 'ATMcode'
});

db.connect(err => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
    } else {
        console.log('Conectado ao banco de dados MySQL');
    }
});

// Rota para validar a senha
app.get('/api/usuario/validar', (req, res) => {
    const { senha } = req.query;
    
    if (!senha) {
        return res.status(400).json({ error: 'Senha é obrigatória' });
    }

    const query = 'SELECT nome FROM usuario WHERE password = ? LIMIT 1';
    db.query(query, [senha], (err, results) => {
        if (err) {
            console.error('Erro na consulta:', err);
            return res.status(500).json({ error: 'Erro interno do servidor' });
        }
        
        if (results.length > 0) {
            res.json({ nome: results[0].nome });
        } else {
            res.status(401).json({ error: 'Senha incorreta' });
        }
    });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});