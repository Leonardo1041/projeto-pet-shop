const express = require('express');
const router = express.Router();
const client = require('../database/connection'); 
const bcrypt = require('bcryptjs');

// Helper para extrair linhas independente do DB (PG ou MySQL)
const getRows = (result) => {
    if (result.rows) return result.rows;
    if (Array.isArray(result)) return result;
    return [];
};

// Rota para listar todos os clientes
// Montado em /api/clientes, então rota é '/'
router.get('/', async (req, res) => {
  try {
    const result = await client.query('SELECT id, nome, email, telefone FROM clientes ORDER BY id');
    res.status(200).json(getRows(result));
  } catch (err) {
    console.error('Erro ao buscar clientes:', err);
    res.status(500).json({ erro: 'Erro ao buscar clientes' });
  }
});

// Rota para inserir um novo cliente
// Montado em /api/clientes, então rota é '/'
router.post('/', async (req, res) => {
  const { nome, email, telefone, senha } = req.body;

  if (!senha) {
    return res.status(400).json({ erro: 'Senha é obrigatória' });
  }

  try {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(senha, salt);

    let newUser;
    try {
        const result = await client.query(
        'INSERT INTO clientes (nome, email, telefone, senha) VALUES ($1, $2, $3, $4) RETURNING id, nome, email, telefone',
        [nome, email, telefone, hash]
        );
        newUser = getRows(result)[0];
    } catch (e) {
        // Fallback para MySQL
        if (e.code === '42601' || e.sqlMessage?.includes('syntax')) {
             await client.query(
                'INSERT INTO clientes (nome, email, telefone, senha) VALUES (?, ?, ?, ?)',
                [nome, email, telefone, hash]
            );
            const resUser = await client.query('SELECT id, nome, email, telefone FROM clientes WHERE email = ?', [email]);
            newUser = getRows(resUser)[0];
        } else {
            throw e;
        }
    }

    res.status(201).json(newUser || { mensagem: "Cliente criado" });
  } catch (err) {
    console.error('Erro ao inserir cliente:', err);
    res.status(500).json({ erro: 'Erro ao inserir cliente' });
  }
});

// Rota de login
// Montado em /api/clientes, então rota é '/login'
router.post('/login', async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ erro: 'Email e senha são obrigatórios' });
  }

  try {
    let result;
    try {
        result = await client.query('SELECT * FROM clientes WHERE email = $1', [email]);
    } catch (e) {
        result = await client.query('SELECT * FROM clientes WHERE email = ?', [email]);
    }

    const rows = getRows(result);
    if (rows.length === 0) {
      return res.status(401).json({ erro: 'Credenciais inválidas' });
    }

    const user = rows[0];
    const match = bcrypt.compareSync(senha, user.senha || '');
    if (!match) {
      return res.status(401).json({ erro: 'Credenciais inválidas' });
    }

    const cliente = {
      id: user.id,
      nome: user.nome,
      email: user.email,
      telefone: user.telefone,
      is_admin: user.is_admin // Retornando flag de admin
    };

    res.status(200).json({ sucesso: true, cliente });
  } catch (err) {
    console.error('Erro ao efetuar login:', err);
    res.status(500).json({ erro: 'Erro ao efetuar login' });
  }
});

module.exports = router;