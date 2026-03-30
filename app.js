const express = require('express');
const { Pool } = require('pg');
const swaggerUi = require('swagger-ui-express');
const cors = require('cors');

const app = express();

app.use(cors()); 
app.use(express.json());

// Configuração do Banco
const pool = new Pool({
  user: 'admin',
  host: 'localhost',
  database: 'teste',
  password: 'admin',
  port: 5434,
});

// Teste de conexão imediato
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error(' ERRO NO BANCO:', err.message);
  } else {
    console.log(' BANCO CONECTADO EM:', res.rows[0].now);
  }
});

// Documentação Mínima para teste
const swaggerDocument = {
  openapi: '3.0.0',
  info: { title: 'API Teste', version: '1.0.0' },
  paths: {
    '/usuarios': {
      get: {
        responses: { '200': { description: 'OK' } }
      },
      post: {
        requestBody: {
          content: { 'application/json': { schema: { type: 'object', properties: { nome: { type: 'string' }, email: { type: 'string' } } } } }
        },
        responses: { '201': { description: 'Criado' } }
      }
    }
  }
};

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Rota POST (Criar)
app.post('/usuarios', async (req, res) => {
  const { nome, email } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO usuarios (nome, email) VALUES ($1, $2) RETURNING *',
      [nome, email]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Rota GET (Listar)
app.get('/usuarios', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM usuarios ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Rota PUT (Editar)
app.put('/usuarios/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, email } = req.body;
  try {
    const result = await pool.query(
      'UPDATE usuarios SET nome = $1, email = $2 WHERE id = $3 RETURNING *',
      [nome, email, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Rota DELETE (Remover)
app.delete('/usuarios/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM usuarios WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }
    res.json({ message: "Usuário removido com sucesso." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => {
  console.log(' Servidor em http://localhost:3000');
  console.log(' Swagger em http://localhost:3000/api-docs');
});