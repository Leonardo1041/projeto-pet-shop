const express = require('express');
const router = express.Router();
const db = require('../database/connection');

// ===== LISTAR TODOS OS PRODUTOS =====
router.get('/loja', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM produtos ORDER BY id DESC');
    const produtos = result.rows;
    res.render('loja', { produtos, message: null });
  } catch (error) {
    console.error('Erro ao listar produtos:', error);
    res.render('loja', { produtos: [], message: 'Erro ao carregar produtos' });
  }
});

// ===== MOSTRAR FORMULÁRIO DE CRIAR NOVO PRODUTO =====
router.get('/loja/novo', (req, res) => {
  res.render('produtoForm', { produto: null, titulo: 'Novo Produto' });
});

// ===== CRIAR NOVO PRODUTO =====
router.post('/loja/criar', async (req, res) => {
  const { nome, tipo, preco, descricao } = req.body;

  if (!nome || !tipo || !preco) {
    return res.render('produtoForm', {
      produto: req.body,
      titulo: 'Novo Produto',
      message: 'Nome, tipo e preço são obrigatórios!'
    });
  }

  try {
    await db.query(
      'INSERT INTO produtos (nome, tipo, preco, descricao) VALUES ($1, $2, $3, $4)',
      [nome, tipo, parseFloat(preco), descricao || '']
    );
    res.redirect('/loja?success=Produto criado com sucesso!');
  } catch (error) {
    console.error('Erro ao criar produto:', error);
    res.render('produtoForm', {
      produto: req.body,
      titulo: 'Novo Produto',
      message: 'Erro ao criar produto!'
    });
  }
});

// ===== MOSTRAR FORMULÁRIO DE EDITAR PRODUTO =====
router.get('/loja/editar/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query('SELECT * FROM produtos WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).send('Produto não encontrado');
    }
    res.render('produtoForm', {
      produto: result.rows[0],
      titulo: 'Editar Produto'
    });
  } catch (error) {
    console.error('Erro ao buscar produto:', error);
    res.status(500).send('Erro ao buscar produto');
  }
});

// ===== ATUALIZAR PRODUTO =====
router.post('/loja/atualizar/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, tipo, preco, descricao } = req.body;

  if (!nome || !tipo || !preco) {
    return res.render('produtoForm', {
      produto: { ...req.body, id },
      titulo: 'Editar Produto',
      message: 'Nome, tipo e preço são obrigatórios!'
    });
  }

  try {
    await db.query(
      'UPDATE produtos SET nome = $1, tipo = $2, preco = $3, descricao = $4 WHERE id = $5',
      [nome, tipo, parseFloat(preco), descricao || '', id]
    );
    res.redirect('/loja?success=Produto atualizado com sucesso!');
  } catch (error) {
    console.error('Erro ao atualizar produto:', error);
    res.render('produtoForm', {
      produto: { ...req.body, id },
      titulo: 'Editar Produto',
      message: 'Erro ao atualizar produto!'
    });
  }
});

// ===== EXCLUIR PRODUTO =====
router.post('/loja/deletar/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await db.query('DELETE FROM produtos WHERE id = $1', [id]);
    res.redirect('/loja?success=Produto removido com sucesso!');
  } catch (error) {
    console.error('Erro ao deletar produto:', error);
    res.redirect('/loja?error=Erro ao remover produto');
  }
});

module.exports = router;