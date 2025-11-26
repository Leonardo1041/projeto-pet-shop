const express = require('express');
const router = express.Router();
const db = require('../database/connection');

// Função auxiliar para responder JSON ou Redirect dependendo do cliente
const respond = (req, res, view, data) => {
  if (req.headers.accept && req.headers.accept.includes('application/json')) {
    return res.json(data);
  }
  return res.render(view, data);
};

// ===== LISTAR TODOS OS PRODUTOS =====
router.get('/loja', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM produtos ORDER BY id DESC');
    const produtos = result.rows;
    respond(req, res, 'loja', { produtos, message: null });
  } catch (error) {
    console.error('Erro ao listar produtos:', error);
    respond(req, res, 'loja', { produtos: [], message: 'Erro ao carregar produtos' });
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
    if (req.headers.accept && req.headers.accept.includes('application/json')) {
       return res.status(400).json({ error: 'Campos obrigatórios faltando' });
    }
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
    
    if (req.headers.accept && req.headers.accept.includes('application/json')) {
        return res.json({ success: true, message: 'Produto criado com sucesso!' });
    }
    res.redirect('/loja?success=Produto criado com sucesso!');
  } catch (error) {
    console.error('Erro ao criar produto:', error);
    if (req.headers.accept && req.headers.accept.includes('application/json')) {
        return res.status(500).json({ error: 'Erro ao criar produto' });
    }
    res.render('produtoForm', {
      produto: req.body,
      titulo: 'Novo Produto',
      message: 'Erro ao criar produto!'
    });
  }
});

// ===== MOSTRAR FORMULÁRIO DE EDITAR PRODUTO (Get One) =====
router.get('/loja/editar/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query('SELECT * FROM produtos WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      if (req.headers.accept && req.headers.accept.includes('application/json')) {
         return res.status(404).json({ error: 'Produto não encontrado' });
      }
      return res.status(404).send('Produto não encontrado');
    }
    
    if (req.headers.accept && req.headers.accept.includes('application/json')) {
        return res.json(result.rows[0]);
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
  // Suporte a PUT via JSON ou POST via Form
  const { nome, tipo, preco, descricao } = req.body;

  if (!nome || !tipo || !preco) {
     if (req.headers.accept && req.headers.accept.includes('application/json')) {
        return res.status(400).json({ error: 'Dados incompletos' });
     }
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
    
    if (req.headers.accept && req.headers.accept.includes('application/json')) {
        return res.json({ success: true });
    }
    res.redirect('/loja?success=Produto atualizado com sucesso!');
  } catch (error) {
    console.error('Erro ao atualizar produto:', error);
    if (req.headers.accept && req.headers.accept.includes('application/json')) {
        return res.status(500).json({ error: 'Erro interno' });
    }
    res.render('produtoForm', {
      produto: { ...req.body, id },
      titulo: 'Editar Produto',
      message: 'Erro ao atualizar produto!'
    });
  }
});

// Suporte para PUT via API
router.put('/loja/atualizar/:id', async (req, res) => {
    // Reutiliza a lógica do POST
    req.method = 'POST';
    // Força header json para garantir resposta json
    req.headers.accept = 'application/json';
    return router.handle(req, res);
});

// ===== EXCLUIR PRODUTO =====
router.post('/loja/deletar/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await db.query('DELETE FROM produtos WHERE id = $1', [id]);
    
    if (req.headers.accept && req.headers.accept.includes('application/json')) {
        return res.json({ success: true });
    }
    res.redirect('/loja?success=Produto removido com sucesso!');
  } catch (error) {
    console.error('Erro ao deletar produto:', error);
    if (req.headers.accept && req.headers.accept.includes('application/json')) {
        return res.status(500).json({ error: 'Erro ao deletar' });
    }
    res.redirect('/loja?error=Erro ao remover produto');
  }
});

// Suporte para DELETE via API
router.delete('/loja/deletar/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM produtos WHERE id = $1', [id]);
        return res.json({ success: true });
    } catch (error) {
        return res.status(500).json({ error: 'Erro ao deletar' });
    }
});

module.exports = router;