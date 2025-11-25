const express = require('express');
const router = express.Router();
const client = require('../database/connection'); // ajuste o caminho conforme necessário
const bcrypt = require('bcryptjs');

// Rota para listar todos os clientes
router.get('/clientes', async (req, res) => {
  try {
    // Não retornar a senha no JSON
    const result = await client.query('SELECT id, nome, email, telefone FROM clientes ORDER BY id');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Erro ao buscar clientes:', err);
    res.status(500).json({ erro: 'Erro ao buscar clientes' });
  }
});

// Rota para inserir um novo cliente
router.post('/clientes', async (req, res) => {
  const { nome, email, telefone, senha } = req.body;

  if (!senha) {
    return res.status(400).json({ erro: 'Senha é obrigatória' });
  }

  try {
    // Gerar hash da senha
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(senha, salt);

    const result = await client.query(
      'INSERT INTO clientes (nome, email, telefone, senha) VALUES ($1, $2, $3, $4) RETURNING id, nome, email, telefone',
      [nome, email, telefone, hash]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Erro ao inserir cliente:', err);
    res.status(500).json({ erro: 'Erro ao inserir cliente' });
  }
});

// Rota de login: compara senha informada com o hash no banco
router.post('/clientes/login', async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ erro: 'Email e senha são obrigatórios' });
  }

  try {
    const result = await client.query('SELECT * FROM clientes WHERE email = $1', [email]);
    if (result.rowCount === 0) {
      return res.status(401).json({ erro: 'Credenciais inválidas' });
    }

    const user = result.rows[0];
    const match = bcrypt.compareSync(senha, user.senha || '');
    if (!match) {
      return res.status(401).json({ erro: 'Credenciais inválidas' });
    }

    // Retornar dados do usuário sem a senha
    const cliente = {
      id: user.id,
      nome: user.nome,
      email: user.email,
      telefone: user.telefone
    };

    res.status(200).json({ sucesso: true, cliente });
  } catch (err) {
    console.error('Erro ao efetuar login:', err);
    res.status(500).json({ erro: 'Erro ao efetuar login' });
  }
});

module.exports = router;